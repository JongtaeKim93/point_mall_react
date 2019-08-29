import axios from 'axios';
import { reaction } from 'mobx';

class HttpService{
    constructor(rootStore){
        this.rootStore = rootStore;
        this.authStore = rootStore.authStore;

        this.clientID = 'SkF4vkzswSTbmKT4gsupiiTUbWVp0e7i4heuOnFA';
        this.refreshSubscribers = []; //요청목록
        this.isRefreshingToken = false;
        axios.defaults.baseURL = 'https://api.pointmall.jongtaekim.com';
        axios.defaults.headers.common['Authorization'] = this.authStore.authToken;

        reaction(() => this.authStore.authToken, () => {
            axios.defaults.headers.common['Authorization'] = this.authStore.authToken;
        });

        axios.interceptors.response.use(response => {
            return response;
        }, originalError => {
            const{ config, response } = originalError;
            const originalRequest = config;
            if(response.status === 401){
                if(this.authStore.refreshToken != null){ //401오류가 나고 토큰이 있을 때
                    if(!this.isRefreshingToken){ //한 번에 여러 번 refresh하지 않기 위해서
                        this.isRefreshingToken = true;
                        return new Promise((resolve, reject) => {
                            this.refreshToken().then(token => {
                                originalRequest.headers.Authorization = this.authStore.authToken;
                                axios(originalRequest).then(response => {
                                    resolve(response);
                                }).catch(error => {
                                    reject(error);
                                });
                                for (let subscriber of this.refreshSubscribers){
                                    subscriber(token);
                                }
                            }).catch(error => {
                                reject(originalError);
                                for (let subscriber of this.refreshSubscribers) {
                                    subscriber(null);
                                }
                            }).finally(() => {
                                this.isRefreshingToken = false;
                                this.refreshSubscribers = [];
                            });
                        });
                    }

                    return new Promise((resolve, reject) => {
                        this.refreshSubscribers.push(token => {
                            if(token == null) {
                                reject(originalError);
                            }
                            else{
                                originalRequest.headers.Authorization = this.authStore.authToken;
                                axios(originalRequest).then(response => {
                                    resolve(response);
                                }).catch(error => {
                                    reject(error);
                                });
                            }
                        });
                    });
                }
            }
            return Promise.reject(originalError);
        });


        //만료된 토큰을 다시 refresh하는 코드
        // axios.interceptors.response.use(response => {
        //     return response;
        // }, originalError => {
        //     const { config, response } = originalError;
        //     const originalRequest = config;
        //         if (response.status === 401) {
        //             if(this.authStore.refreshToken == null){
        //                 alert('로그인이 필요한 서비스입니다.');
        //                 this.rootStore.history.push('/login');  
        //             }
        //             else{
        //                 if(!this.isRefreshingToken){
        //                     this.isRefreshingToken = true;
        //                     return new Promise((resolve, reject) => {
        //                         this.refreshToken().then(token => {
        //                                 originalRequest.headers.Authorization = this.authStore.authToken;
        //                                 resolve(axios(originalRequest));
        //                                 for(let subscriber of this.refreshSubscribers){
        //                                     subscriber(token);
        //                                 }
        //                         }).catch(error => {
        //                             this.authStore.deleteToken();
        //                             reject(originalError);
        //                             alert('로그인이 필요한 서비스입니다.');
        //                             this.rootStore.history.push('/login');
        //                             for(let subscriber of this.refreshSubscribers){
        //                                 subscriber(null);
        //                             }
        //                         }).finally(() => {
        //                             this.refreshSubscribers = [];
        //                             this.isRefreshingToken = false;
        //                         });
        //                     });
        //                 }
        //                 return new Promise((resolve, reject) => {
        //                     this.refreshSubscribers.push(token => {
        //                         if(token == null){
        //                             reject(originalError);
        //                         }
        //                         else{
        //                             originalRequest.headers.Authorization = this.authStore.authToken;
        //                             resolve(axios(originalRequest));
        //                         }
        //                     });
        //                 });
        //             }
        //         }
        //         return Promise.reject(originalError);
        //     });
    }

    getItem(itemId){
        return axios.get('/items/' + itemId + '/')
            .then(response =>{
                return response.data;
            });
    }

    getMe(){
        return axios.get('/me/').then(response => {
            return response.data;
        });;
    }

    indexItems(){
        return axios.get('/items/')
            .then(response => {
                return response.data;
        });
    }

    indexCategoryItems(categoryId){
            return axios.get('/categories/' + categoryId + '/items/')
                .then(response => {
                    return response.data;
                });
    }

    indexTagItems(tag) {
        return axios.get('/tags/' + tag + '/items/')
            .then(response => {
                return response.data;
            });
    }

    indexCategories(){
        return axios.get('/categories/')
            .then(response => {
                return response.data;
            });
    }

    indexMyItems(){
        return axios.get('/me/items/')
            .then(response => {
                return response.data;
        });
    }

    purchaseItem(itemId){
        return axios.post('/items/' + itemId + '/purchase/')
            .then(response => {
                return response.data;
            });
    }

    purchaseItems(items){
        return axios.post('/items/purchase/', { items })
        .then(response => {
            return response.data;
        }); 
    }
    
    register(username, password){
        return axios.post('/users/', {
            username,
            password
        }).then(response => {
            return response.data;
        });
    }

    login(username, password){
        return axios.post('/o/token/',
            {
                grant_type: 'password',
                client_id: this.clientID,
                username,
                password
            }).then(response => {
                const token = response.data;
                this.authStore.setToken(token)
                return token;
            });
    }

    refreshToken(username, password) {
        return axios.post('/o/token/',
            {
                grant_type: 'refresh_token',
                client_id: this.clientID,
                refresh_token: this.authStore.refreshToken
            }).then(response => {
                const token = response.data;
                this.authStore.setToken(token)
                return token;
            });
    }

    indexHistory(){
        return axios.get('/histories/')
            .then(response => {
                return response.data;
            });
    }

    refundHistory(historyId){
        return axios.post('/histories/' + historyId + '/refund/')
            .then(response => {
                return response.data;
            });
    }
}

export default HttpService;
