'use client';
import { useTheme } from './utils';
import { UserService } from '@/services/userService';
import './styles/home/home_style.scss';
import { useEffect, useState } from 'react';
import { handleLogout } from '@/services/authService';
import { useRouter } from 'next/navigation';

const Home = () => {
    const theme = useTheme();
    const router = useRouter();
    const [usernamePlaceholder, setUsernamePlaceholder] = useState('');

    useEffect(() => {
        const getUsername = async () => {
            try {
                const u = await UserService.getCurrentUser();
                setUsernamePlaceholder(u.data.username);
            } catch (err: any) {
                if (err.response?.status !== 403) {
                    console.error('Unexpected error:', err);
                }
                setUsernamePlaceholder('please, authenticate');
            }
        };
        getUsername();
    }, []);

    const logoutAndRedirect = async () => {
        await handleLogout();
        router.push('/auth');
    };

    return (
        <section className={`section ${theme}`}>
            <h1>Hello, {`${usernamePlaceholder}!`}</h1>
            {usernamePlaceholder !== 'please, authenticate' ? (
                <button onClick={logoutAndRedirect}>Logout</button>
            ) : null}
        </section>
    );
};

export default Home;
