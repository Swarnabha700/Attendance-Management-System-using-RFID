import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Report = () => {
    const [date, setDate] = useState('');
    const [attendance, setAttendance] = useState(null);
    const [notFound, setNotFound] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/dailyreport', { date });
            if (response.data === '404 not found') {
                setNotFound(true);
                setAttendance(null);
            } else {
                setNotFound(false);
                setAttendance(response.data);
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    return (
        <div className="h-[90.8vh] bg-gradient-to-bl from-[#dee3fa] to-[#c8daf8] p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto p-8 bg-gradient-to-t from-[#77c2ff] to-[#cc79ff] rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold text-center mb-6">Daily Attendance Report</h1>

                <form onSubmit={handleSubmit} className="flex flex-col items-center mb-8">
                    <label htmlFor="date" className="mb-2 text-lg">Select Date:</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)}
                        className="border border-gray-300 rounded p-2 mb-4" />
                    <motion.button type="submit" className="bg-[#5d1ec4] text-white py-2 px-6 rounded-lg shadow-md hover:bg-[#5827cc] transition-transform duration-300"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Submit
                    </motion.button>
                </form>

                {notFound && <h2 className="text-red-500 text-center">No Record Found for Date: {date}</h2>}

                {attendance && (
                    <div className="overflow-x-auto">
                        <table className="w-full mt-6 text-left border-collapse">
                            <thead>
                                <tr className="bg-[#5d1ec4] text-white">
                                    <th className="p-3">Roll No.</th>
                                    <th className="p-3">Firstname</th>
                                    <th className="p-3">Lastname</th>
                                    <th className="p-3">Department</th>
                                    <th className="p-3">Subject Code</th>
                                    <th className="p-3">Entry Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((item, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="p-3">{item.roll}</td>
                                        <td className="p-3">{item.fname}</td>
                                        <td className="p-3">{item.lname}</td>
                                        <td className="p-3">{item.department}</td>
                                        <td className="p-3">{item.scode}</td>
                                        <td className="p-3">{item.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Report;
