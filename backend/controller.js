
// import fs from 'fs';

// export const readJSONFile = (filename) => {  
//     try {
//         if (!fs.existsSync(filename)) return []; 
//         return JSON.parse(fs.readFileSync(filename, 'utf-8'));
//     } catch (error) {
//         console.error(`Error reading ${filename}:`, error);
//         return [];
//     }
// };

// export const writeJSONFile = (filename, data) => {  
//     try {
//         fs.writeFileSync(filename, JSON.stringify(data, null, 2));
//     } catch (error) {
//         console.error(`Error writing ${filename}:`, error);
//     }
// };

// export const chooseCardId = () => {
//     const cards = readJSONFile('card.json');
//     const unassignedCards = cards.filter(card => card.status !== 'assigned');
//     if (unassignedCards.length === 0) return -1;
//     return unassignedCards[Math.floor(Math.random() * unassignedCards.length)].id;
// };

// export const assignCard = (cardId) => {
//     const cards = readJSONFile('card.json');
//     const cardIndex = cards.findIndex(card => card.id === cardId);
//     if (cardIndex !== -1) {
//         cards[cardIndex].status = 'assigned';
//         writeJSONFile('card.json', cards);
//         console.log(`Card ${cardId} assigned.`);
//     }
// };

// export const getCurrentDate = () => new Date().toISOString().split('T')[0];
// export const getCurrentTime = () => new Date().toTimeString().split(' ')[0];



// export const registerStudent = (req, res) => {
//     let student = req.body;
//     let students = readJSONFile('students.json');
//     let cardId = chooseCardId();
//     if (cardId === -1) {
//         return res.status(404).json({ message: "No card left to assign" });
//     }
//     assignCard(cardId);
//     students.push({ ...student, card: cardId });
//     writeJSONFile('students.json', students);
//     res.status(200).json({
//         message: `Card assigned to ${student.fname} ${student.lname}`,
//         cardId: cardId
//     });
// };


// export const startAttendance = (req, res) => {
//     const currentDate = getCurrentDate();
//     let attendance = readJSONFile('attendance.json');
//     if (attendance.some(record => record.Date === currentDate)) {
//         return res.send('Attendance for today has already been started');
//     }
//     attendance.push({ Date: currentDate, Record: [] });
//     writeJSONFile('attendance.json', attendance);
//     res.send('Attendance for today has been started');
// };

// export const addAttendance = (req, res) => {
//     let students = readJSONFile('students.json');
//     let student = students.find(s => s.card === req.body.rfid);
//     if (!student) return res.send("Denied");
//     let attendance = readJSONFile('attendance.json');
//     let todayRecord = attendance.find(record => record.Date === getCurrentDate());
//     if (!todayRecord) return res.send("Attendance not started for today");
//     if (todayRecord.Record.some(record => record.roll === student.roll)) {
//         return res.send(`${student.fname} ${student.lname} has already been marked present`);
//     }
//     todayRecord.Record.push({ ...student, time: getCurrentTime() });
//     writeJSONFile('attendance.json', attendance);
//     res.send("Attendance recorded");
// };


import { getConnection } from './db.js';

export const getCurrentDate = () => new Date().toISOString().split('T')[0];
export const getCurrentTime = () => new Date().toTimeString().split(' ')[0];

export const chooseCardId = async () => {
  const connection = await getConnection();
  const result = await connection.execute(
    `SELECT id FROM cards WHERE status != 'assigned'`
  );
  if (result.rows.length === 0) return -1;
  const randomIndex = Math.floor(Math.random() * result.rows.length);
  return result.rows[randomIndex][0];
};

export const assignCard = async (cardId) => {
  const connection = await getConnection();
  await connection.execute(
    `UPDATE cards SET status = 'assigned' WHERE id = :cardId`,
    [cardId]
  );
  console.log(`Card ${cardId} assigned.`);
};

export const registerStudent = async (req, res) => {
  const student = req.body;
  const cardId = await chooseCardId();
  if (cardId === -1) {
    return res.status(404).json({ message: "No card is left to assign" });
  }

  await assignCard(cardId);

  const connection = await getConnection();
  await connection.execute(
    `INSERT INTO students (roll, fname, lname, department, scode, card_id)
     VALUES (:roll, :fname, :lname, :department, :scode, :cardId)`,
    {
      roll: student.roll,
      fname: student.fname,
      lname: student.lname,
      department: student.department,
      scode: student.scode,
      cardId: cardId
    }
  );

  res.status(200).json({
    message: `Card assigned to ${student.fname} ${student.lname}`,
    cardId: cardId
  });
};

export const startAttendance = async (req, res) => {
  res.json({ message: 'Ready to mark today’s attendance.' });
};

export const addAttendance = async (req, res) => {
  const rfid = req.body.rfid;
  const connection = await getConnection();

  const studentResult = await connection.execute(
    `SELECT roll, fname, lname, department, scode FROM students WHERE card_id = :rfid`,
    [rfid]
  );

  if (studentResult.rows.length === 0) {
    return res.status(403).send("denied");
  }

  const [roll, fname, lname, department, scode] = studentResult.rows[0];
  const today = getCurrentDate();
  const timeNow = new Date();

  const checkResult = await connection.execute(
    `SELECT * FROM attendance
     WHERE roll = :roll AND TRUNC(attendance_time) = TO_DATE(:today, 'YYYY-MM-DD')`,
    { roll, today }
  );

  if (checkResult.rows.length > 0) {
    return res.status(409).send(`${fname} ${lname} has already been marked present`);
  }

  await connection.execute(
    `INSERT INTO attendance (roll, fname, lname, department, scode, attendance_time)
     VALUES (:roll, :fname, :lname, :department, :scode, :timeNow)`,
    {
      roll,
      fname,
      lname,
      department,
      scode,
      timeNow
    }
  );

  res.status(200).send("granted");
};
