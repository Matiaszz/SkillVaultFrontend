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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await UserService.getCurrentUser();
                setUser(fetchedUser.data);
            } catch (err: any) {
                if (err?.response?.status !== 403) {
                    console.error('Unexpected error on user handling:', err);
                }
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    return user;
};

export const useGetUserById = (id: string | string[]) => {
    const [user, setUser] = useState<UserResponseDTO | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await UserService.getUserById(id);
                setUser(fetchedUser);
            } catch (err: any) {
                switch (err?.response?.status) {
                    case 403:
                        router.push('/auth');
                }

                setUser(null);
            }
        };

        fetchUser();
    }, []);

    return user;
};