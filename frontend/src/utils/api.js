import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const loginUser = (data) =>
  API.post('/auth/login', data);

export const registerUser = (data) =>
  API.post('/auth/register', data);

export const getDonations = () =>
  API.get('/donations');

export const getMyDonations = () =>
  API.get('/donations/my/donations');

export const createDonation = (data) =>
  API.post('/donations', data);

export const requestDonation = (id) =>
  API.patch(`/donations/${id}/request`);

export const pickupDonation = (id) =>
  API.patch(`/donations/${id}/pickup`);

export const deliverDonation = (id) =>
  API.patch(`/donations/${id}/deliver`);

export const getStats = () =>
  API.get('/stats');

export default API;