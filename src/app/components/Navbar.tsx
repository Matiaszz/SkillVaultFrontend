'use client';

import React, { useState, useEffect, useRef, FC } from 'react';
import { FileText, Bell, User, ChevronDown, ChevronUp, ClipboardList, Award, LogOut } from 'lucide-react';
import styles from '@/app/styles/navbar.module.scss';
import { useTheme, useGetLoggedUser } from '../hooks';
import { useRouter } from 'next/navigation';
import { handleLogout } from '@/services/authService';

type DropdownMenuProps = {
    userId: string;
};

const DropdownMenu: FC<DropdownMenuProps> = ({ userId }) => {
    const router = useRouter();
    const logoutAndRedirect = async () => {
        await handleLogout();
        router.push('/auth');
    };

    return (
        <div className={styles.dropdownMenu} role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
            <button
                onClick={() => router.push(`/profile/${userId}`)}
                className={styles.dropdownItem}
                role="menuitem"
            >
                <User size={18} />
                <span>Profile</span>
            </button>

            <a href="#" className={styles.dropdownItem} role="menuitem">
                <ClipboardList size={18} />
                <span>Evaluations</span>
            </a>

            <a href="#" className={styles.dropdownItem} role="menuitem">
                <Award size={18} />
                <span>Certificades</span>
            </a>

            <button onClick={logoutAndRedirect} className={styles.dropdownItem} role="menuitem">
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </div>
    );
};

const Navbar: FC = () => {
    const theme = useTheme();
    const router = useRouter();
    const { user: loggedUser, isLoading } = useGetLoggedUser();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isLoggedIn = !!loggedUser;
    const isAdminOrEvaluator = loggedUser?.role === 'ADMIN' || loggedUser?.role === 'EVALUATOR';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className={`${styles.nav} ${theme === 'dark' ? styles.dark : styles.light}`}>
            <div className={styles.logo}>
                <button onClick={() => router.push('/')}>SV</button>
            </div>

            <div className={styles.menu}>
                {!isLoggedIn && (
                    <button
                        className={styles.reviewsButton}
                        onClick={() => router.push('/auth')}
                    >
                        Login
                    </button>
                )}

                {isLoggedIn && (
                    <>
                        {isAdminOrEvaluator && (
                            <button className={styles.reviewsButton}>
                                <FileText size={18} />
                                <span>My Reviews</span>
                            </button>
                        )}


                        <button className={styles.notificationButton}>
                            <Bell size={22} />
                        </button>

                        <div className={styles.profileDropdown} ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!isDropdownOpen)}
                                className={styles.profileButton}
                            >
                                <div className={styles.profileIconWrapper}>
                                    <User size={20} />
                                </div>
                                {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {isDropdownOpen && <DropdownMenu userId={loggedUser.id} />}
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
