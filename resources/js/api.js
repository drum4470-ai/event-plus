import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    }
});
export const csrfApi = axios.create({

    withCredentials: true,
});

// レスポンスを監視して、認証エラー(401)があったら強制的にログイン画面へ飛ばす
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         // 現在のURLがログインページならリダイレクト処理をスキップする
//         const isLoginPage = window.location.pathname.includes('/administrator/login');

//         if (error.response?.status === 401 && !isLoginPage) {
//             window.location.href = '/administrator/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default api;