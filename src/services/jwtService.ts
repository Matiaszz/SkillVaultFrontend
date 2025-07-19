import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
    exp: number;
    [key: string]: any;
};

export function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Token inválido:', error);
        return true;
    }
}