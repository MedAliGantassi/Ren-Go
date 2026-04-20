import api from './api';

export const getMyWishlist = () => api.get('/wishlist');

export const toggleWishlistItem = (propertyId) => api.post('/wishlist/toggle', { propertyId });
