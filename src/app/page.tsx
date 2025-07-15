'use client';

import { useTheme, useGetLoggedUser } from './hooks';
import { handleLogout } from '@/services/authService';
import { useRouter } from 'next/navigation';
import './styles/home/home_style.scss';
import { useEffect, useState } from 'react';

const Home = () => {
    const theme = useTheme();
    const router = useRouter();
    const [usernamePlaceholder, setUsernamePlaceholder] = useState('please, authenticate');

    const loggedUser = useGetLoggedUser();

    useEffect(() => {
        if (loggedUser !== null) {
            setUsernamePlaceholder(loggedUser.username);
        }
    }, [loggedUser]);

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
