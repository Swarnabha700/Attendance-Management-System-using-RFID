import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Update this with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies in requests if needed
});

export default api;

