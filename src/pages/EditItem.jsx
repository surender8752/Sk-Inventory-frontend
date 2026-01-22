import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { itemAPI } from '../services/api';
import '../pages/AddItem.css';

const EditItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        price: '',
        description: '',
        lowStockThreshold: '10'
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await itemAPI.getById(id);
            const item = response.data;
            setFormData({
                name: item.name,
                category: item.category,
                quantity: item.quantity.toString(),
                price: item.price.toString(),
                description: item.description || '',
                lowStockThreshold: item.lowStockThreshold?.toString() || '10'
            });
        } catch (error) {
            console.error('Error fetching item:', error);
            setError('Failed to load item details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await itemAPI.update(id, {
                ...formData,
                quantity: Number(formData.quantity),
                price: Number(formData.price),
                lowStockThreshold: Number(formData.lowStockThreshold)
            });

            navigate('/inventory');
        } catch (error) {
            console.error('Error updating item:', error);
            setError(error.response?.data?.message || 'Failed to update item');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading item details...</p>
            </div>
        );
    }

    return (
        <div className="add-item fade-in">
            <div className="container">
                <div className="form-container">
                    <div className="form-header">
                        <h1>Edit Item</h1>
                        <p>Update the item details</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="item-form card">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Item Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter item name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category" className="form-label">Category *</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    className="form-input"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Electronics, Furniture"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="quantity" className="form-label">Quantity *</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    className="form-input"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    placeholder="0"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price" className="form-label">Price (₹) *</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    className="form-input"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lowStockThreshold" className="form-label">Low Stock Alert</label>
                                <input
                                    type="number"
                                    id="lowStockThreshold"
                                    name="lowStockThreshold"
                                    className="form-input"
                                    value={formData.lowStockThreshold}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="10"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-textarea"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter item description (optional)"
                                rows="4"
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/inventory')}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={submitting}
                            >
                                {submitting ? 'Updating...' : '✓ Update Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditItem;
