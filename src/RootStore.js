import AuthStore from "./AuthStore";
import ItemStore from "./ItemStore";
import HttpService from "./HttpService";

export default class RootStore {

    constructor() {        
        this.authStore = new AuthStore(this);
        this.itemStore = new ItemStore(this);
        this.httpService = new HttpService(this);
    }
}
