import { ParamValue } from 'next/dist/server/request/params';
import api from './api';
import { UserResponseDTO } from '@/app/responses';


export const UserService = {
    getCurrentUser: () => api.get('/user'),
    getUserById: async (id: ParamValue) => {
        const normalizedId = Array.isArray(id) ? id[0] : id;
        const res = await api.get<UserResponseDTO>(`/user/${normalizedId}`);
        return res.data;
    }
};