import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = () => {
    const [showModal, setShowModal] = useState(false);
    const [records, setRecords] = useState([]);
    const [fetchIntervalId, setFetchIntervalId] = useState(null);

    const startAttendance = () => {
        setShowModal(true);
        axios.post('http://localhost:3000/startattendance')
            .then(() => getAttendance())
            .catch(error => console.error('Error:', error));
    };

    const stopAttendance = () => {
        setShowModal(false);
        if (fetchIntervalId) clearInterval(fetchIntervalId);
    };

    const getAttendance = () => {
        let prevLength = 0;
        const intervalId = setInterval(() => {
            axios.get('http://localhost:3000/addattendance')
                .then(response => {
                    const data = response.data;
                    if (data.length > 0 && (prevLength === 0 || data[0].Record.length > prevLength)) {
                        setRecords(data[0].Record);
                        prevLength = data[0].Record.length;
                    }
                })
                .catch(error => console.error('Error:', error));
        }, 100);
        setFetchIntervalId(intervalId);
    };

    return (
        <div className='h-[90.8vh] bg-gradient-to-t from-[#77c2ff] to-[#cc79ff]'>
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center text-white p-8">
                <h1 className="text-6xl font-bold mb-4 drop-shadow-xl mt-20">Smart Attendance System</h1>
                <p className="text-xl mb-8 max-w-3xl">Effortlessly manage and track attendance with real-time updates and seamless integration.</p>
                <button
                    className="bg-purple-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-purple-950 transform transition-transform hover:scale-105 duration-300"
                    onClick={startAttendance}
                >
                    Start Attendance
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center p-8">
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out">
                        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-screen-lg overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-purple-900 text-white">
                                        <th className="p-2 text-left">Roll No.</th>
                                        <th className="p-2 text-left">Firstname</th>
                                        <th className="p-2 text-left">Lastname</th>
                                        <th className="p-2 text-left">Department</th>
                                        <th className="p-2 text-left">Subject Code</th>
                                        <th className="p-2 text-left">Entry at</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record, index) => (
                                        <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                                            <td className="p-2 border">{record.roll}</td>
                                            <td className="p-2 border">{record.fname}</td>
                                            <td className="p-2 border">{record.lname}</td>
                                            <td className="p-2 border">{record.department}</td>
                                            <td className="p-2 border">{record.scode}</td>
                                            <td className="p-2 border">{record.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transform transition-transform hover:scale-105 duration-300 mt-6"
                                onClick={stopAttendance}
                            >
                                Stop Attendance
                            </button>
                        </div>
                    </div>
                )}
            </div>
            </div>
    );
};

export default Attendance;
