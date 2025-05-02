import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
    const closemobileMenu = () => setMobileMenuOpen(false);

    const navLinks = [
        { path: '/', label: 'Attendance' },
        { path: '/register', label: 'Registration' },
        { path: '/report', label: 'Report' },
        { path: '/dashboard', label: 'Dashboard' }
    ];

    return (
        <nav className="bg-gradient-to-r from-[#660066d0] via-purple-800 to-[#9900cc]">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img className="h-8 w-auto" src="./icon.png" alt="Your Company" />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navLinks.map(({ path, label }, index) => (
                                    <NavLink
                                        key={index}
                                        to={path}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "bg-gray-900 text-white px-3 py-2 rounded-md text-base font-medium"
                                                : "text-white hover:bg-white hover:text-black px-3 py-2 rounded-md text-base font-medium"
                                        }
                                    >
                                        {label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="sm:hidden fixed inset-0 top-[58px] bg-black bg-opacity-50 z-50" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2 bg-gradient-to-r from-[#660066d0] via-purple-800 to-[#9900cc]">
                        {navLinks.map(({ path, label }, index) => (
                            <NavLink
                                key={index}
                                to={path}
                                onClick={closemobileMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "block bg-gray-900 text-white px-3 py-2 rounded-md text-base font-medium"
                                        : "block text-white px-3 py-2 rounded-md text-base font-medium"
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
