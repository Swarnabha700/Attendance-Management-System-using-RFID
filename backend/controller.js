
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
