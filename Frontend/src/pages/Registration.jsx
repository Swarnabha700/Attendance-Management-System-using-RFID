import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Registration = () => {
  const [formData, setFormData] = useState({
    roll: '',
    fname: '',
    lname: '',
    department: '',
    scode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3000/register', formData)
      .then((response) => alert('Student registered successfully!'))
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="md:h-[90.8vh] bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 border border-cyan-300 rounded-2xl bg-gray-800 shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-cyan-400">Student Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          {['roll', 'fname', 'lname', 'department', 'scode'].map((field) => (
            <div key={field} className="relative">
              <label htmlFor={field} className="block text-sm font-medium text-cyan-300 mb-1">
                {field.toUpperCase()}
              </label>
              <motion.input
                type="text"
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                whileFocus={{ scale: 1.05 }}
              />
            </div>
          ))}
          <motion.button
            type="submit"
            className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: -1.05 }}
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Registration;
