import axios from 'axios';

// Backend port default is 5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const urlApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default urlApi;
