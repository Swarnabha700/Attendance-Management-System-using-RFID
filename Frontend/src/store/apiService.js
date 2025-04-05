import api from '../lib/axios';

export const registerStudent = async (studentData) => {
    try {
        const response = await api.post('/register', studentData);
        return response.data;
    } catch (error) {
        console.error('Error registering student:', error);
        throw error;
    }
};

export const startAttendance = async () => {
    try {
        const response = await api.post('/startattendance');
        return response.data;
    } catch (error) {
        console.error('Error starting attendance:', error);
        throw error;
    }
};

export const addAttendance = async (rfid) => {
    try {
        const response = await api.post('/addattendance', { rfid });
        return response.data;
    } catch (error) {
        console.error('Error adding attendance:', error);
        throw error;
    }
};

export const getAttendanceByDate = async (date) => {
    try {
        const response = await api.post('/dailyreport', { date });
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance:', error);
        throw error;
    }
};
