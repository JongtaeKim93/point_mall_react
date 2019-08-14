import AuthStore from "./AuthStore";
import ItemStore from "./ItemStore";
import HttpService from "./HttpService";
import { createBrowserHistory } from 'history';

export default class RootStore {

    constructor() {
        this.history = createBrowserHistory();
        this.authStore = new AuthStore(this);
        this.itemStore = new ItemStore(this);
        this.httpService = new HttpService(this);
    }
}
