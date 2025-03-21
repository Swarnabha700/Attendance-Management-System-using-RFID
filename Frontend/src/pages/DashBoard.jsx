import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, User, FileText } from 'lucide-react';

const DashBoard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-bl from-[#e9defa] to-[#fbfcdb] text-gray-800">
            {/* Navbar */}
            <div className="w-full bg-gray-900 p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">Student Dashboard</h1>
                <button 
                    className="md:hidden text-white"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    ☰
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <motion.aside
                    initial={{ x: -200 }}
                    animate={{ x: isSidebarOpen || window.innerWidth >= 768 ? 0 : -200 }}
                    transition={{ duration: 0.5 }}
                    className="md:w-64 w-56 bg-gray-900 shadow-lg p-6 flex flex-col space-y-6 md:relative fixed top-32 md:top-auto left-0 z-20 h-52 md:min-h-screen"
                >
                    <nav className="space-y-4">
                        {[
                            { name: 'Home', icon: <Home /> },
                            { name: 'Courses', icon: <BookOpen /> },
                            { name: 'Reports', icon: <FileText /> },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer bg-gray-700 hover:bg-teal-500 transition-all"
                            >
                                {item.icon}
                                <span className="text-white">{item.name}</span>
                            </motion.div>
                        ))}
                    </nav>
                </motion.aside>

                {/* Main Content */}
                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 p-8 ml-0 mt-12 md:mt-0"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['Attendance', 'Assignments', 'Grades', 'Notifications', 'Events', 'Settings'].map((card, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="p-6 bg-gradient-to-br from-[#2097ff] to-[#b640ff] rounded-2xl shadow-lg cursor-pointer"
                            >
                                <h2 className="text-xl font-bold mb-2 text-white">{card}</h2>
                                <p className="text-sm font-semibold text-black">Click to view details</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.main>
            </div>
        </div>
    );
};

export default DashBoard;