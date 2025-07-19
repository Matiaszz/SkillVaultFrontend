'use client';

import React, { useState, useEffect, useRef, FC } from 'react';
import { FileText, Bell, User, ChevronDown, ChevronUp, ClipboardList, Award, LogOut } from 'lucide-react';
import styles from '@/app/styles/navbar.module.scss';
import { useTheme } from '../hooks';


const DropdownMenu: FC = () => (
    <div className={styles.dropdownMenu} role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
        <a href="#" className={styles.dropdownItem} role="menuitem">
            <User size={18} />
            <span>Profile</span>
        </a>
        <a href="#" className={styles.dropdownItem} role="menuitem">
            <ClipboardList size={18} />
            <span>Evaluations</span>
        </a>
        <a href="#" className={styles.dropdownItem} role="menuitem">
            <Award size={18} />
            <span>Certificates</span>
        </a>
        <a href="#" className={styles.dropdownItem} role="menuitem">
            <LogOut size={18} />
            <span>Logout</span>
        </a>
    </div>
);

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
                <h1>SV</h1>
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