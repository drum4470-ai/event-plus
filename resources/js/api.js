// api.js
const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    }
});
// axiosは脆弱性あり
export default api;

// auth.js
export const csrfApi = axios.create({
    withCredentials: true,
});