export const baseURL =
    (() => {
        try {
            const baseUrl = window.localStorage.baseUrl;
            if (typeof baseUrl === 'string') {
                return baseUrl;
            }
        } catch (e) {
            console.log(e);
        }
        if (window.location.origin === 'http://localhost:3000' || window.location.origin === 'http://127.0.0.1:3000') {
            return 'http://localhost:8080';
        }

        return null;
    })() || 'http://localhost:8080';
