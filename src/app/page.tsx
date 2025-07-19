'use client';

import { useTheme, useGetLoggedUser } from './hooks';
import { handleLogout } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { Power } from 'lucide-react';
import '@/app/styles/home/home_style.scss';
import { useEffect, useState } from 'react';

const Home = () => {
    const theme = useTheme();
    const router = useRouter();
    const [welcomeMessage, setWelcomeMessage] = useState<string>('');

    const loggedUser = useGetLoggedUser();

    useEffect(() => {
        const baseMessage = "Welcome to SkillVault! An application that you get your certifications and skills validated by the most professional and authorized people";
        if (loggedUser) {
            setWelcomeMessage(`Hello, ${loggedUser.name}. ${baseMessage}`);
        } else {
            setWelcomeMessage(baseMessage);
        }
    }, [loggedUser]);



    const handleGetStarted = () => {
        if (loggedUser) {
            router.push('/dashboard');
        } else {
            router.push('/auth');
        }
    };

    return (
        <section className={`section ${theme}`}>
            <div className={'homeContainer'}>
                <div className={'logo'}>
                    <h1>SV</h1>
                </div>
                <div className={'welcomeText'}>
                    <p>{welcomeMessage}</p>
                </div>
                <button onClick={handleGetStarted} className={'ctaButton'}>
                    <Power size={16} />
                    <span>Get started now</span>
                </button>
            </div>
        </section>
    );
};


export default Home;
