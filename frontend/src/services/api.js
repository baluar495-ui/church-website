import axios from 'axios';

const API_URL = 'http://localhost:3003/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sermonsAPI = {
    getAll: () => api.get('/sermons'),
    getById: (id) => api.get(`/sermons/${id}`),
};

export const eventsAPI = {
    getAll: () => api.get('/events'),
    getUpcoming: () => api.get('/events/upcoming'),
};

export default api;