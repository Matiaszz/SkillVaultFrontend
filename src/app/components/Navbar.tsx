'use client';

import React, { useState, useEffect, useRef, FC } from 'react';
import { FileText, Bell, User, ChevronDown, ChevronUp, ClipboardList, Award, LogOut } from 'lucide-react';
import styles from '@/app/styles/navbar.module.scss';
import { useTheme } from '../hooks';
import { useRouter } from 'next/navigation';
import { handleLogout } from '@/services/authService';

const DropdownMenu: FC = () => {
    const router = useRouter();

    // A função de logout está agora corretamente definida.
    const logoutAndRedirect = async () => {
        await handleLogout();
        router.push('/auth');
    };

    // O return está agora no local correto, fora da função de logout.
    return (
        <div className={styles.dropdownMenu} role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
            <a href="#" className={styles.dropdownItem} role="menuitem">
                <User size={18} />
                <span>Perfil</span>
            </a>
            <a href="#" className={styles.dropdownItem} role="menuitem">
                <ClipboardList size={18} />
                <span>Avaliações</span>
            </a>
            <a href="#" className={styles.dropdownItem} role="menuitem">
                <Award size={18} />
                <span>Certificados</span>
            </a>
            {/* O item de logout é agora um botão que chama a função correta no onClick. */}
            <button onClick={logoutAndRedirect} className={styles.dropdownItem} role="menuitem">
                <LogOut size={18} />
                <span>Sair</span>
            </button>
        </div>
    );
};

// --- Main Navbar Component ---
const Navbar: FC = () => {
    const theme = useTheme();
    const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // This effect handles closing the dropdown when clicking outside of it.
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    return (
        <nav className={`${styles.nav} ${theme === 'dark' ? styles.dark : styles.light}`}>
            {/* Left side: Logo */}
            <div className={styles.logo}>
                <h1><a>SV</a></h1>
            </div>

            {/* Right side: Menu items */}
            <div className={styles.menu}>
                {/* My Reviews Button */}
                <button className={styles.reviewsButton}>
                    <FileText size={18} />
                    <span>My Reviews</span>
                </button>

                {/* Notification Button */}
                <button className={styles.notificationButton}>
                    <Bell size={22} />
                </button>

                {/* Profile Dropdown */}
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

                    {/* Conditional rendering of the dropdown menu */}
                    {isDropdownOpen && <DropdownMenu />}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;