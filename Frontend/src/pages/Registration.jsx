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
    <div className="md:h-[90.8vh] bg-gradient-to-bl from-[#dee3fa] to-[#c8daf8] flex items-center justify-center p-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-md overflow-hidden flex"
      >
        <div className="hidden md:block md:w-1/2">
          <img src="./reg.png" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-8 bg-gradient-to-t from-[#77c2ff] to-[#cc79ff]">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">Student Registration</h1>
          <form onSubmit={handleSubmit} className="space-y-3">
            {['roll', 'fname', 'lname', 'department', 'scode'].map((field) => (
              <div key={field} className="relative">
                <label htmlFor={field} className="block text-sm font-medium text-black mb-1">
                  {field.toUpperCase()}
                </label>
                <motion.input
                  type="text"
                  name={field}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.05 }}
                />
              </div>
            ))}
            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-[#5d1ec4] via-[#5827cc] to-[#8d2de7] hover:bg-cyan-600 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Registration;
