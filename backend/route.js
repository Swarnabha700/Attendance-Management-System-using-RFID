// import express from 'express';
// import { registerStudent, startAttendance, addAttendance, readJSONFile, getCurrentDate } from './controller.js'; // Import getCurrentDate
// const router = express.Router();

// router.get('/', (req, res) => res.render('index'));

// router.get('/dailyreport', (req, res) => res.render('report', { title: "form" }));

// router.post('/dailyreport', (req, res) => {
//     let attendance = readJSONFile('attendance.json');
//     let record = attendance.find(record => record.Date === req.body.date);

//     if (record) {
//         res.json(record.Record);
//     } else {
//         res.status(404).json({ message: 'No record found' });
//     }
// });

// //router.get('/register', (req, res) => res.render('studentRegister'));
// //router.post('/register', registerStudent);
// router.post('/register', registerStudent); 

// router.post('/startattendance', startAttendance);
// router.post('/addattendance', addAttendance);

// router.get('/addattendance', (req, res) => {
//     let attendance = readJSONFile('attendance.json');
//     let recordToday = attendance.find(att => att.Date === getCurrentDate());
//     res.send(recordToday || {});
// });

// export default router;


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

// Submit date to fetch attendance report
// router.post('/dailyreport', async (req, res) => {
//   const connection = await getConnection();
//   const selectedDate = req.body.date;

//   const result = await connection.execute(
//     `SELECT roll, fname, lname, department, scode, attendance_time
//      FROM attendance
//      WHERE TRUNC(attendance_time) = TO_DATE(:selectedDate, 'YYYY-MM-DD')`,
//     { selectedDate }
//   );

//   if (result.rows.length === 0) {
//     return res.status(404).json({ message: 'No record found' });
//   }

//   const records = result.rows.map(([roll, fname, lname, department, scode, attendance_time]) => ({
//     roll,
//     fname,
//     lname,
//     department,
//     scode,
//     time: attendance_time
//   }));

//   res.json(records);
// });

// /dailyreport
router.post('/dailyreport', async (req, res) => {
    const connection = await getConnection();
    const selectedDate = req.body.date;
  
    const result = await connection.execute(
      `SELECT roll, fname, lname, department, scode, attendance_time
       FROM attendance
       WHERE TRUNC(attendance_time) = TO_DATE(:selectedDate, 'YYYY-MM-DD')`,
      { selectedDate }
    );
  
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No record found' });
    }
  
    const records = result.rows.map(([roll, fname, lname, department, scode, attendance_time]) => {
      const formattedTime = new Date(attendance_time).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
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

// Get today's attendance
// router.get('/addattendance', async (req, res) => {
//   const connection = await getConnection();
//   const today = getCurrentDate();

//   const result = await connection.execute(
//     `SELECT roll, fname, lname, department, scode, attendance_time
//      FROM attendance
//      WHERE TRUNC(attendance_time) = TO_DATE(:today, 'YYYY-MM-DD')`,
//     { today }
//   );

//   const records = result.rows.map(([roll, fname, lname, department, scode, attendance_time]) => ({
//     roll,
//     fname,
//     lname,
//     department,
//     scode,
//     time: attendance_time
//   }));

//   res.json({
//     Date: today,
//     Record: records
//   });
// });

// /addattendance (GET - for today's record)
router.get('/addattendance', async (req, res) => {
    const connection = await getConnection();
    const today = getCurrentDate();
  
    const result = await connection.execute(
      `SELECT roll, fname, lname, department, scode, attendance_time
       FROM attendance
       WHERE TRUNC(attendance_time) = TO_DATE(:today, 'YYYY-MM-DD')`,
      { today }
    );
  
    const records = result.rows.map(([roll, fname, lname, department, scode, attendance_time]) => {
      const formattedTime = new Date(attendance_time).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
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
