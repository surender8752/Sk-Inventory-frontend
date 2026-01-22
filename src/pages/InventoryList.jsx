import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemAPI } from '../services/api';
import './InventoryList.css';

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        filterItems();
    }, [searchTerm, categoryFilter, items]);

    const fetchItems = async () => {
        try {
            const response = await itemAPI.getAll();
            setItems(response.data);
            setFilteredItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterItems = () => {
        let filtered = items;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }

        setFilteredItems(filtered);
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await itemAPI.delete(id);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Failed to delete item');
            }
        }
    };

    const categories = ['all', ...new Set(items.map(item => item.category))];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading inventory...</p>
            </div>
        );
    }

    return (
        <div className="inventory-list fade-in">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1>Inventory Management</h1>
                        <p>Manage all your inventory items</p>
                    </div>
                    <Link to="/add-item" className="btn btn-primary">
                        ➕ Add New Item
                    </Link>
                </div>

                <div className="filters-section card">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="form-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="category-filter">
                        <select
                            className="form-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {filteredItems.length === 0 ? (
                    <div className="empty-state card">
                        <p>No items found.</p>
                        {items.length === 0 && (
                            <Link to="/add-item" className="btn btn-primary">Add Your First Item</Link>
                        )}
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total Value</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <strong>{item.name}</strong>
                                            {item.description && (
                                                <div className="item-description">{item.description}</div>
                                            )}
                                        </td>
                                        <td>{item.category}</td>
                                        <td>{item.quantity}</td>
                                        <td>₹{item.price}</td>
                                        <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            {item.isLowStock ? (
                                                <span className="badge badge-warning">Low Stock</span>
                                            ) : item.quantity === 0 ? (
                                                <span className="badge badge-error">Out of Stock</span>
                                            ) : (
                                                <span className="badge badge-success">In Stock</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link
                                                    to={`/edit-item/${item._id}`}
                                                    className="btn-icon btn-edit"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item._id, item.name)}
                                                    className="btn-icon btn-delete"
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="inventory-summary card">
                    <h3>Summary</h3>
                    <p>Showing {filteredItems.length} of {items.length} items</p>
                </div>
            </div>
        </div>
    );
};

export default InventoryList;
