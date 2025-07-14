import api from './api';

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
    login: (data: LoginPayload) => api.post('/auth/user/login', data),
    register: (data: RegisterPayload) => api.post('/auth/user/register', data),
    logout: () => api.post('/auth/logout')
};

export const handleLogout = async () => {
    try {
        await AuthService.logout();
    } catch (err) {
        console.error('Erro no logout:', err);
    }
};