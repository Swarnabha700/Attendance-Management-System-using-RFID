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
        <div className="min-h-screen flex flex-col items-center">
            <h1 className="text-3xl py-6 font-bold text-gray-800">Smart Attendance System</h1>
            <img src="./homepage.png" alt="Attendance Logo" className="mb-6 size-40 md:size-60" />
            <button
                className="bg-purple-800 text-white py-2 px-4 rounded mb-6 shadow-md hover:bg-purple-950 transform transition-transform hover:scale-105 duration-300"
                onClick={startAttendance}
            >
                Start Attendance
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ">
                    <table className="w-11/12 bg-white border-collapse rounded-lg shadow-lg overflow-hidden">
                        <thead>
                            <tr className="bg-purple-900 text-white">
                                <th className="p-2">Roll No.</th>
                                <th className="p-2">Firstname</th>
                                <th className="p-2">Lastname</th>
                                <th className="p-2">Department</th>
                                <th className="p-2">Subject Code</th>
                                <th className="p-2">Entry at</th>
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
                        className="bg-red-500 text-white py-2 px-4 rounded mt-6 shadow-md hover:bg-red-700 transform transition-transform hover:scale-105 duration-300"
                        onClick={stopAttendance}
                    >
                        Stop Attendance
                    </button>
                </div>
            )}
        </div>
    );
};

export default Attendance;