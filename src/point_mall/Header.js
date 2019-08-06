import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { observer } from 'mobx-react';
import DataHelper from '../DataHelper';
import { inject } from 'mobx-react';

@inject('authStore')
@observer
class Header extends React.Component{
    helper = new DataHelper();
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: this.helper.isLoggedIn,
            categories: []
        };
    }
    
    componentDidMount(){
        this.indexCategories();
    }

    indexCategories(){
        axios.get(DataHelper.baseURL() + '/categories/')
            .then((response) => {
                const categories = response.data;
                this.setState({
                    categories: categories
                });
            });
    }

    logout = () => {
        const { authStore } = this.props;
        authStore.deleteToken();
    }

    render(){
        const { authStore } = this.props;
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
                <Link to="/cart/items">김종태's Cart</Link>
                {
                    authStore.isLoggedIn && <Link to="/me/items">김종태's Items</Link>
                }
                {
                    authStore.isLoggedIn ?
                        <button onClick={this.logout}>Logout</button> :
                        <Link to="/login">Login</Link>
                }
            </div>
        </header>
        )
    }
}

export default Header;