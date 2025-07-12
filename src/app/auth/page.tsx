'use client';
import '@/app/styles/auth/authStyle.scss';
import '@/app/styles/globals.scss';
import { useTheme } from '@/app/utils';
import WorkerSvg from '../../../public/presentation_worker.svg';
import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Auth() {
    const theme = useTheme();

    const [endpoint, setEndpoint] = useState<'register' | 'login'>('register');
    const [prevEndpoint, setPrevEndpoint] = useState<'register' | 'login'>('register');

    const switchFormState = () => {
        setPrevEndpoint(endpoint);
        setEndpoint(prev => (prev === 'register' ? 'login' : 'register'));
    };

    const getDirection = () => {
        return endpoint === 'register' && prevEndpoint === 'login' ? -1 : 1;
    };

    const direction = getDirection();

    return (
        <section className={`section ${theme} gap-30`}>
            <div className='svg-container'>
                <Image src={WorkerSvg} alt="Worker" width={400} height={400} />
            </div>

            <div className='form'>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={endpoint}
                        initial={{ opacity: 0, x: 25 * direction }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -25 * direction }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1>{endpoint === 'register' ? 'Register' : 'Login'}</h1>

                        <form>
                            <input type="email" placeholder="Email" />
                            <input type="password" placeholder="Password" />

                            {endpoint === 'register' && (
                                <input type="text" placeholder="Username" />
                            )}

                            <button type="submit">
                                {endpoint === 'register' ? 'Create Account' : 'Login'}
                            </button>
                        </form>

                        <button type="button" onClick={switchFormState}>
                            Switch to {endpoint === 'register' ? 'Login' : 'Register'}
                        </button>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
