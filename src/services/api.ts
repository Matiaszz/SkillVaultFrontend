import axios from 'axios';

const url = process.env.NEXT_PUBLIC_API_URL;
console.log('API baseURL:', url);

const api = axios.create({
    baseURL: url,
    withCredentials: true,

});


export default api;