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

export const prayerAPI = {
    submit: (data) => api.post('/prayer', data),
    getPublic: () => api.get('/prayer/public'),
    incrementPrayer: (id) => api.put(`/prayer/${id}/pray`),  // ← ADD THIS
};
// ADD THIS - Contact API
export const contactAPI = {
    submit: (data) => api.post('/contact', data),
};
// ADD THIS - Leadership API
export const leadershipAPI = {
    getAll: () => api.get('/leadership'),
    getById: (id) => api.get(`/leadership/${id}`),
};
export default api;