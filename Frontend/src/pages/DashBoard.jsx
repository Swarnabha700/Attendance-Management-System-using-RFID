import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, User, FileText } from 'lucide-react';

const DashBoard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            {/* Navbar */}
            <div className="w-full bg-gray-800 p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold text-cyan-400">Student Dashboard</h1>
                <button 
                    className="md:hidden text-cyan-400"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    ☰
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <motion.aside
                    initial={{ x: -200 }}
                    animate={{ x: isSidebarOpen ? 0 : -200 }}
                    transition={{ duration: 0.5 }}
                    className="md:w-64 w-56 bg-gray-800 shadow-lg p-6 flex flex-col space-y-6 fixed md:relative top-32 md:top-0 left-0 z-20"
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
                                className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer bg-gray-700 hover:bg-cyan-600 transition-all"
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </motion.div>
                        ))}
                    </nav>
                </motion.aside>

                {/* Main Content */}
                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 p-8 ml-0 md:ml-64 mt-12 md:mt-0"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['Attendance', 'Assignments', 'Grades', 'Notifications', 'Events', 'Settings'].map((card, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="p-6 bg-gray-700 rounded-2xl shadow-lg cursor-pointer transition-all hover:bg-cyan-600"
                            >
                                <h2 className="text-xl font-bold mb-2">{card}</h2>
                                <p className="text-sm text-gray-300">Click to view details</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.main>
            </div>
        </div>
    );
};

export default DashBoard;
