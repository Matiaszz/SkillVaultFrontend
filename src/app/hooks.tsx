'use client';
import { useEffect, useState } from "react";
import { UserService } from "@/services/userService";
import { UserResponseDTO } from "./responses";
import { useRouter } from "next/navigation";

export const useTheme = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('light');

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
        mediaQuery.addEventListener('change', handler);

        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return theme;
};

export const useGetLoggedUser = () => {
    const [user, setUser] = useState<UserResponseDTO | null>(null);
    // 1. Adicionar o estado de carregamento, começando como 'true'
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            try {
                const fetchedUser = await UserService.getCurrentUser();
                if (isMounted) {
                    setUser(fetchedUser.data);
                }
            } catch (err: any) {
                if (err?.response?.status !== 403) {
                    console.error('Unexpected error on user handling:', err);
                }
                if (isMounted) {
                    setUser(null);
                }
            } finally {
                // 2. Usar 'finally' para garantir que o carregamento termine,
                // não importa se a busca deu certo ou errado.
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, []);

    // 3. Retornar um objeto com o usuário E o estado de carregamento
    return { user, isLoading };
};
export const useGetUserById = (id: string | string[]) => {
    const [user, setUser] = useState<UserResponseDTO | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            try {
                const fetchedUser = await UserService.getUserById(id);
                if (isMounted) {
                    setUser(fetchedUser);
                }
            } catch (err: any) {
                console.error('Failed to get user by id:', err);
                if (isMounted) {
                    setUser(null);
                }
            }
        };

        if (id) {
            fetchUser();
        }

        return () => {
            isMounted = false;
        };
    }, [id]);

    return user;
};