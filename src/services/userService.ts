import api from './api';

export const UserService = {
    getCurrentUser: () => api.get('/user'),
};