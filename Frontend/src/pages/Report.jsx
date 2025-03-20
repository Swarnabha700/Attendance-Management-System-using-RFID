import React, { useState } from 'react';
import axios from 'axios';

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
        <div className="bg-white min-h-screen flex flex-col items-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center my-4">
                <label htmlFor="date" className="mb-2">Choose one date:</label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-gray-300 rounded p-2 mb-4"
                />
                <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">Submit</button>
            </form>

            {notFound && <h1 className="text-red-500">No Record Found for Date: {date}</h1>}

            {attendance && (
                <div className="overflow-x-auto">
                    <table className="w-full bg-gray-200 mt-6">
                        <thead>
                            <tr className="bg-green-500 text-white">
                                <th>Roll No.</th>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Department</th>
                                <th>Subject Code</th>
                                <th>Entry at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.roll}</td>
                                    <td>{item.fname}</td>
                                    <td>{item.lname}</td>
                                    <td>{item.department}</td>
                                    <td>{item.scode}</td>
                                    <td>{item.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Report;
