import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
    const toggleProfileMenu = () => setProfileMenuOpen(!isProfileMenuOpen);
    const closeProfileMenu = () => setProfileMenuOpen(false);
    const closemobileMenu = () => setMobileMenuOpen(false);

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
                                {['/', '/register', '/report'].map((path, index) => (
                                    <NavLink
                                        key={index}
                                        to={path}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "bg-gray-900 text-white px-3 py-2 rounded-md text-base font-medium"
                                                : "text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                                        }
                                    >
                                        {path === '/' ? 'Attendance' : path === '/register' ? 'Registration' : 'Report'}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative ml-3">
                        <button
                            type="button"
                            onClick={toggleProfileMenu}
                            className="flex rounded-full bg-gray-800 text-sm focus:outline-none"
                        >
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                        </button>

                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <NavLink to="/dashboard" className="block px-4 py-2 text-sm text-gray-700" onClick={closeProfileMenu}>Your Profile</NavLink>
                                <NavLink to="#" className="block px-4 py-2 text-sm text-gray-700" onClick={closeProfileMenu}>Settings</NavLink>
                                <NavLink to="#" className="block px-4 py-2 text-sm text-gray-700" onClick={closeProfileMenu}>Sign out</NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="sm:hidden fixed inset-0 top-[58px] bg-black bg-opacity-50 z-50" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2 bg-gradient-to-r from-[#660066d0] via-purple-800 to-[#9900cc]">
                        {['/', '/register', '/report'].map((path, index) => (
                            <NavLink
                                key={index}
                                to={path}
                                onClick={closemobileMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "block bg-gray-900 text-white px-3 py-2 rounded-md text-base font-medium"
                                        : "block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                                }
                            >
                                {path === '/' ? 'Attendance' : path === '/register' ? 'Registration' : 'Report'}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;