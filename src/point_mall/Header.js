import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react';

@inject('httpService', 'authStore', 'itemStore', 'history')
@observer
class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchText: '',
            categories: []
        };
    }
    
    componentDidMount(){
        this.indexCategories();
    }

    indexCategories(){
        this.props.httpService.indexCategories()
            .then(categories => {
                this.setState({
                    categories
                });
            });
    }

    logout = () => {
        const { authStore } = this.props;
        authStore.deleteToken();
    }

    onInputChanged = (event) => {
        const target = event.target;
        if(target.name === 'search'){
            this.setState({
                searchText: target.value
            });
        }
    }

    search = () => {
        this.props.history.push('/tags/' + this.state.searchText);
    }

    render(){
        const { authStore, itemStore } = this.props;
        const categories = this.state.categories.map((category) => {
            return (
                <Link key={category.id} to={'/categories/' + category.id}>{category.title}</Link>
            )
        });
         return (
        <header>
            <Link to="/">이것은 김종태의 홈페이지</Link>
            {categories}
            <div className="header-right">
                <Link to="/cart/items">김종태's Cart {itemStore.cartItemsCount}</Link>
                {
                    authStore.isLoggedIn &&
                        <Link to="/me/histories">구매내역</Link>
                }
                {
                    authStore.isLoggedIn ?
                        <Link to="/me/items">김종태's Items</Link> :
                        <Link to="/register">회원가입</Link>
                }
                {
                    authStore.isLoggedIn ?
                        <button onClick={this.logout}>로그아웃</button> :
                        <Link to="/login">로그인</Link>
                }
                <input
                style={{marginLeft: '1em'}}
                value={this.state.searchText}
                onChange={this.onInputChanged}
                type="text"
                name="search" />
                <button onClick={this.search}>태그검색</button>
            </div>
        </header>
        )
    }
}

export default Header;
