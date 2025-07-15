'use client';
import '@/app/styles/globals.scss';
import { useTheme, useGetLoggedUser, useGetUserById } from '@/app/hooks';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { UserService } from '@/services/userService';
import { UserResponseDTO } from '@/app/responses';

export default function Profile() {
    const theme = useTheme();
    const param = useParams();
    const loggedUser = useGetLoggedUser();

    if (param.id === undefined) {
        return (
            <section className={`section ${theme}`}>
                <h1>404 - Not found</h1>
            </section>
        )
    }

    const [userById, setUserById] = useState<UserResponseDTO | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const user = await UserService.getUserById(param.id);
                setUserById(user);
            } catch {
                setUserById(null);
            }
        };
        fetch();
    }, [param.id]);
    if (userById === null) {
        return (
            <section className={`section ${theme}`}>
                <h1>404 - Not found</h1>
            </section>
        )
    }

    return (
        <section className={`section ${theme}`}>
            <h1>teste {userById?.name}</h1>
        </section>
    )
}