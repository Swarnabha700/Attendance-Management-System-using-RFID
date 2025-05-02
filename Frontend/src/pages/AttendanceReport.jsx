import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceReport = () => {
  // Mock attendance data
  const attendanceData = {
    present: 80,
    absent: 15,
    late: 5,
  };

  const data = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        label: 'Attendance Summary',
        data: [attendanceData.present, attendanceData.absent, attendanceData.late],
        backgroundColor: [
          '#D8B4FE', // Soft lavender (Present)
          '#A855F7', // Deep purple (Absent)
          '#F472B6', // Rosy pink (Late)
        ],
        hoverBackgroundColor: [
          '#C084EA', // hover for Present
          '#9333FE', // hover for Absent
          '#EC4899', // hover for Late
        ],
        borderColor: ['#fff'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-3">
      <h1 className="text-xl sm:text-2xl font-semibold mb-2 text-center sm:text-left">
        Attendance Report
      </h1>

      <div className="w-full max-w-md mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <Pie data={data} options={options} />
      </div>

      <div className="mt-6 bg-purple-100 font-medium p-4 rounded text-sm sm:text-base w-full max-w-md mx-auto">
        {Object.entries(attendanceData).map(([key, value], index) => (
          <p key={index}>
            {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AttendanceReport;
