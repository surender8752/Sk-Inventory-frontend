import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-icon">📦</span>
                        <span className="brand-text">SK Inventory Manager</span>
                    </Link>

                    <ul className="navbar-menu">
                        <li>
                            <Link to="/" className={`nav-link ${isActive('/')}`}>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/inventory" className={`nav-link ${isActive('/inventory')}`}>
                                Inventory
                            </Link>
                        </li>
                        <li>
                            <Link to="/add-item" className={`nav-link ${isActive('/add-item')}`}>
                                Add Item
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
