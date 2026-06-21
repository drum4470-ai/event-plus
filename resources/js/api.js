import axios from 'axios';

const api = axios.create({
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    }
});

// CSRFトークンを自動的に取得して付与するための初期化
api.get('/sanctum/csrf-cookie');

export default api;