import api from './api';
import Cookies from 'js-cookie';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    name: string;
    password: string;
    username: string;
}

export const AuthService = {
    login: async (data: LoginPayload) => {
        try {
            const res = await api.post('/auth/user/login', data);
            return res.data;
        } catch (err: any) {
            if (err.response?.status === 409) {
                Cookies.remove('userToken');

                try {
                    const retryRes = await api.post('/auth/user/login', data);
                    return retryRes.data;
                } catch (retryErr) {
                    throw retryErr;
                }
            }

            throw err;
        }
    },

    register: (data: RegisterPayload) => api.post('/auth/user/register', data),
    logout: () => api.post('/auth/logout')
};

export const handleLogout = async () => {
    try {
        await AuthService.logout();
        Cookies.remove('userToken');
        window.location.href = '/auth';
    } catch (err) {
        console.error('Erro no logout:', err);
    }
};
