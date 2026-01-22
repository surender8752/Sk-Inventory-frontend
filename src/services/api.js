import axios from 'axios';

const API_BASE_URL = 'https://sk-inventory-backend-5u1djf9hq.vercel.app/' || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Item API calls
export const itemAPI = {
    // Get all items
    getAll: () => api.get('/items'),

    // Get single item
    getById: (id) => api.get(`/items/${id}`),

    // Create new item
    create: (itemData) => api.post('/items', itemData),

    // Update item
    update: (id, itemData) => api.put(`/items/${id}`, itemData),

    // Delete item
    delete: (id) => api.delete(`/items/${id}`),

    // Get statistics
    getStats: () => api.get('/items/stats/summary'),
};

export default api;
