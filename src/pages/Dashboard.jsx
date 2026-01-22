import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalItems: 0,
        totalValue: 0,
        lowStockItems: 0,
        totalQuantity: 0
    });
    const [recentItems, setRecentItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, itemsRes] = await Promise.all([
                itemAPI.getStats(),
                itemAPI.getAll()
            ]);

            setStats(statsRes.data);
            setRecentItems(itemsRes.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard fade-in">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <p>Overview of SK Inventory Manager system</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                            📊
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalItems}</h3>
                            <p>Total Items</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                            💰
                        </div>
                        <div className="stat-content">
                            <h3>₹{stats.totalValue}</h3>
                            <p>Total Value</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a, #fee140)' }}>
                            ⚠️
                        </div>
                        <div className="stat-content">
                            <h3>{stats.lowStockItems}</h3>
                            <p>Low Stock Alerts</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #30cfd0, #330867)' }}>
                            📦
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalQuantity}</h3>
                            <p>Total Quantity</p>
                        </div>
                    </div>
                </div>

                <div className="recent-items-section">
                    <div className="section-header">
                        <h2>Recent Items</h2>
                        <Link to="/inventory" className="btn btn-secondary">View All</Link>
                    </div>

                    {recentItems.length === 0 ? (
                        <div className="empty-state card">
                            <p>No items in inventory yet.</p>
                            <Link to="/add-item" className="btn btn-primary">Add Your First Item</Link>
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
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentItems.map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.name}</td>
                                            <td>{item.category}</td>
                                            <td>{item.quantity}</td>
                                            <td>₹{item.price}</td>
                                            <td>
                                                {item.isLowStock ? (
                                                    <span className="badge badge-warning">Low Stock</span>
                                                ) : (
                                                    <span className="badge badge-success">In Stock</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
