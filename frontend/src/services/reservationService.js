import api from './api';

export const createReservation = (payload) => api.post('/reservations', payload);

export const getMyReservations = () => api.get('/reservations/me');
