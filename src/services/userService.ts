import { ParamValue } from 'next/dist/server/request/params';
import api from './api';
import { UserResponseDTO } from '@/app/responses';


export const UserService = {
    getCurrentUser: () => api.get('/user'),
    getUserById: async (id: ParamValue) => {
        const res = await api.get<UserResponseDTO>(`/users/${id}`);
        return res.data;

    }
};