import express from 'express';
import { registerStudent, startAttendance, addAttendance, readJSONFile, getCurrentDate } from './controller.js'; // Import getCurrentDate
const router = express.Router();

router.get('/', (req, res) => res.render('index'));

router.get('/dailyreport', (req, res) => res.render('report', { title: "form" }));

router.post('/dailyreport', (req, res) => {
    let attendance = readJSONFile('attendance.json');
    let record = attendance.find(record => record.Date === req.body.date);

    if (record) {
        res.json(record.Record);
    } else {
        res.status(404).json({ message: 'No record found' });
    }
});

//router.get('/register', (req, res) => res.render('studentRegister'));
//router.post('/register', registerStudent);
router.post('/register', registerStudent); 

router.post('/startattendance', startAttendance);
router.post('/addattendance', addAttendance);

router.get('/addattendance', (req, res) => {
    let attendance = readJSONFile('attendance.json');
    let recordToday = attendance.find(att => att.Date === getCurrentDate());
    res.send(recordToday || {});
});

export default router;
