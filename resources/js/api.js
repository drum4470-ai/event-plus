// api.js
const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;

            // パスの中に "administrator" または "admin" が含まれているか判定
            const isAdminPath =
                currentPath.includes("/administrator") ||
                currentPath.includes("/admin");

            if (isAdminPath) {
                if (currentPath !== "/administrator/login") {
                    window.location.href = "/administrator/login";
                }
            } else {
                if (currentPath !== "/login") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    },
);
export default api;

// auth.js
export const csrfApi = axios.create({
    withCredentials: true,
});
