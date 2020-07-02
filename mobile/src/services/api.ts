import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.2.220:3333'
});

export default api;

