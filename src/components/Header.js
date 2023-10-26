import React from 'react'
import '../styles/header.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { useStateValue } from "../StateProvider";
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const Header = () => {
    const [{ basket, user }, dispatch] = useStateValue();

    const handleSearchInput = (e) => {
        dispatch({
            type: 'SEARCH',
            searchInput: e.target.value,
        });
    }

    const handleAuthentication = () => {
        if (user) {
            const confirmSignOut = window.confirm('Are you sure you want to sign out?');
            if (confirmSignOut) {
                auth.signOut();
            }
        }
    }
    return (
        <div className="header">
            <Link to='/'>
                <img
                    className="logo"
                    src="http://pngimg.com/uploads/amazon/amazon_PNG11.png"
                    alt='logo'
                />
            </Link>


            <div className="search">
                <input
                    className="searchInput"
                    type="text"
                    placeholder='Search your products...'
                    onChange={handleSearchInput}
                />
                <SearchIcon className="searchIcon" />
            </div>

            <div className="nav">
                <Link to={!user && '/login'} style={{ textDecoration: 'none', color: 'white' }}>
                    <div className="option" onClick={handleAuthentication}>
                        <span className="optionLineOne">
                            Hello {user ? user.email : 'Guest'}
                        </span>
                        <span className="optionLineTwo">
                            {user ? 'Sign Out' : 'Sign In'}
                        </span>
                    </div>
                </Link>

                <div className="option">
                    <Link to="/orders" style={{ textDecoration: 'none', color: 'white' }}>
                        <div>
                            <span className="optionLineOne">Returns</span>
                            <span className="optionLineTwo">Orders</span>
                        </div>
                    </Link>
                </div>

                <div className="option">
                    <span className="optionLineOne">Your</span>
                    <span className="optionLineTwo">Prime</span>
                </div>
                <Link to='/checkout'>
                    <div className="optionBasket">
                        <ShoppingCartIcon />
                        <span className="optionLineTwo basketCount">
                            {basket?.length}
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Header;