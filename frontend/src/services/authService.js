import api from './api';

export const login = (payload) => api.post('/auth/login', payload);

export const register = (payload) => api.post('/auth/register', payload);

export const loginWithGoogle = (payload) => api.post('/auth/google', payload);
