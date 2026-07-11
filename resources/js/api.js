import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    }
});

// レスポンスを監視して、認証エラー(401)があったら強制的にログイン画面へ飛ばす
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // ここでReactのログイン画面へ移動させる
            // もし React Router の navigate を使いたい場合は 
            // 別の方法(context等)が必要ですが、まずはこれで十分です
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;