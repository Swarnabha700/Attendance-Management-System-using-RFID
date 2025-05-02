
import express from 'express';
import {
  registerStudent,
  startAttendance,
  addAttendance,
  getCurrentDate
} from './controller.js';

import { getConnection } from './db.js';

const router = express.Router();

router.get('/', (req, res) => res.render('index'));
router.get('/dailyreport', (req, res) => res.render('report', { title: "form" }));


// /dailyreport
router.post('/dailyreport', async (req, res) => {
    const connection = await getConnection();
    const selectedDate = req.body.date;
  
    const result = await connection.execute(
      `SELECT roll, fname, lname, department, scode, attendance_time
       FROM attendance
       WHERE TRUNC(attendance_time) = TO_DATE(:selectedDate, 'YYYY-MM-DD') ORDER BY attendance_time ASC`,
      { selectedDate }
    );
  
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No record found' });
    }
  
    const records = result.rows.map(([roll, fname, lname, department, scode, attendance_time]) => {
      const formattedTime = new Date(attendance_time).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
  
      return {
        roll,
        fname,
        lname,
        department,
        scode,
        time: formattedTime
      };
    });
  
    res.json(records);
  });
  

router.post('/register', registerStudent);
router.post('/startattendance', startAttendance);
router.post('/addattendance', addAttendance);

  
router.get('/addattendance', async (req, res) => {
  const connection = await getConnection();
  const today = getCurrentDate();

  const result = await connection.execute(
    `SELECT roll, fname, lname, department, scode, attendance_time
     FROM attendance
     WHERE TRUNC(attendance_time) = TO_DATE(:today, 'YYYY-MM-DD')
     ORDER BY attendance_time ASC`, 
    { today }
  );

  const records = result.rows.map(([roll, fname, lname, department, scode, attendance_time]) => {
    const formattedTime = new Date(attendance_time).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return {
      roll,
      fname,
      lname,
      department,
      scode,
      time: formattedTime
    };
  });

  res.json({
    Date: today,
    Record: records
  });
});


export default router;
