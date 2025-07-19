'use client';

import { useTheme, useGetLoggedUser } from './hooks';
import { handleLogout } from '@/services/authService';
import { useRouter } from 'next/navigation';
import './styles/home/home_style.scss';
import { useEffect, useState } from 'react';

const Home = () => {
    const theme = useTheme();
    const router = useRouter();
    const [usernamePlaceholder, setUsernamePlaceholder] = useState('');

    const loggedUser = useGetLoggedUser();

    useEffect(() => {
        console.log('loggedUser:', loggedUser);
        if (loggedUser !== null) {
            setUsernamePlaceholder(`Hello, ${loggedUser.name}`);
        }
    }, [loggedUser]);

    const logoutAndRedirect = async () => {
        await handleLogout();
        router.push('/auth');
    };

    return (
        <section className={`section ${theme}`}>
            <div className='home-container'>
                <div>

                    <h1>SV</h1>
                </div>
                <div>
                    <p>
                        {`${usernamePlaceholder}${usernamePlaceholder !== '' ? '.' : ''} `}
                        Welcome to SkillVault! An application that you get your certifications
                        and skills validated by the most professional and authorized people
                    </p>
                </div>
                {loggedUser && (
                    <button onClick={logoutAndRedirect}>Logout</button>
                )}
            </div>



        </section>
    );
};

export default Home;
