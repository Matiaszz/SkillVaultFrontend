'use client';
import '@/app/styles/auth/authStyle.scss';
import '@/app/styles/globals.scss';
import { useTheme } from '@/app/utils';
import WorkerSvg from '../../../public/presentation_worker.svg';
import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthService, LoginPayload, RegisterPayload } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Auth() {
    const theme = useTheme();
    const router = useRouter();

    const [endpoint, setEndpoint] = useState<'register' | 'login'>('register');
    const [prevEndpoint, setPrevEndpoint] = useState<'register' | 'login'>('register');

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const [loading, setLoading] = useState(false);

    const switchFormState = () => {
        setPrevEndpoint(endpoint);
        setEndpoint(prev => (prev === 'register' ? 'login' : 'register'));

        setName('');
        setEmail('');
        setPassword('');
        setUsername('');
    };

    const getDirection = () => {
        return endpoint === 'register' && prevEndpoint === 'login' ? -1 : 1;
    };

    const direction = getDirection();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (endpoint === 'register') {
                if (!email || !name || !password || !username) {
                    toast.error("Please, fill all the fields");
                    return;
                }

                const payload: RegisterPayload = { email, name, password, username };
                const res = await AuthService.register(payload);
                console.log('Registered user:', res.data);
                router.push('/');
            } else {
                const payload: LoginPayload = { email, password };
                const res = await AuthService.login(payload);
                console.log('Logged user:', res.data);
                router.push('/');
            }
        }
        catch (err: any) {
            const res = err.response;

            if (!res) {
                toast.error("Erro desconhecido de conexão.");
                return;
            }

            switch (res.status) {
                case 422:
                case 400:
                    const errors = res.data;
                    if (typeof errors === 'object' && !Array.isArray(errors) && endpoint) {
                        const mensagens = Object.entries(errors).map(([field, msg]) => `${field}: ${msg}`);
                        mensagens.forEach(msg => toast.error(msg));
                    } else if (Array.isArray(errors.errors)) {
                        toast.error(errors.errors.join('\n'));
                    } else {
                        toast.error("Erro de validação.");
                    }
                    break;

                case 401:
                case 404:
                    toast.error("User not found, verify your credentials.");
                    break;

                case 409:
                    toast.error(res.data.reason || "Usuário já autenticado. Faça logout primeiro.");
                    break;



                default:
                    console.error('Erro inesperado:', err);
                    toast.error("Erro inesperado ao tentar autenticar.");
            }

        } finally {
            setLoading(false);
        }
    };

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

                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />

                            {endpoint === 'register' && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={loading}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                    />
                                </>
                            )}

                            <button type="submit" disabled={loading}>
                                {loading
                                    ? endpoint === 'register' ? 'Creating...' : 'Logging in...'
                                    : endpoint === 'register' ? 'Create Account' : 'Login'}
                            </button>
                        </form>

                        <button type="button" onClick={switchFormState} disabled={loading}>
                            Switch to {endpoint === 'register' ? 'Login' : 'Register'}
                        </button>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
