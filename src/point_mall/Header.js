import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            categories: []
        };
    }

    componentDidMount(){
        this.indexCategories();
    }

    indexCategories(){
        axios.get('http://localhost:8002/categories/')
            .then((response) => {
                const categories = response.data;
                this.setState({
                    categories: categories
                });
            });
    }

    render(){
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
                <Link to="/me/items">My Items</Link>
                <Link to="/login">Login</Link>
            </div>
        </header>
    )
    }
}

export default Header;