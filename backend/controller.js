
import fs from 'fs';

export const readJSONFile = (filename) => {  
    try {
        if (!fs.existsSync(filename)) return []; 
        return JSON.parse(fs.readFileSync(filename, 'utf-8'));
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
};

export const writeJSONFile = (filename, data) => {  
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
    }
};

export const chooseCardId = () => {
    const cards = readJSONFile('card.json');
    const unassignedCards = cards.filter(card => card.status !== 'assigned');
    if (unassignedCards.length === 0) return -1;
    return unassignedCards[Math.floor(Math.random() * unassignedCards.length)].id;
};

export const assignCard = (cardId) => {
    const cards = readJSONFile('card.json');
    const cardIndex = cards.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
        cards[cardIndex].status = 'assigned';
        writeJSONFile('card.json', cards);
        console.log(`Card ${cardId} assigned.`);
    }
};

export const getCurrentDate = () => new Date().toISOString().split('T')[0];
export const getCurrentTime = () => new Date().toTimeString().split(' ')[0];

// export const registerStudent = (req, res) => {
//     let student = req.body;
//     let students = readJSONFile('students.json');
//     let cardId = chooseCardId();
//     if (cardId === -1) return res.status(404).send("No card left to assign");
//     assignCard(cardId);
//     students.push({ ...student, card: cardId });
//     writeJSONFile('students.json', students);
//     res.send(`Card assigned to ${student.fname} ${student.lname}`);
// };

export const registerStudent = (req, res) => {
    let student = req.body;
    let students = readJSONFile('students.json');
    let cardId = chooseCardId();
    if (cardId === -1) {
        return res.status(404).json({ message: "No card left to assign" });
    }
    assignCard(cardId);
    students.push({ ...student, card: cardId });
    writeJSONFile('students.json', students);
    res.status(200).json({
        message: `Card assigned to ${student.fname} ${student.lname}`,
        cardId: cardId
    });
};


export const startAttendance = (req, res) => {
    const currentDate = getCurrentDate();
    let attendance = readJSONFile('attendance.json');
    if (attendance.some(record => record.Date === currentDate)) {
        return res.send('Attendance for today has already been started');
    }
    attendance.push({ Date: currentDate, Record: [] });
    writeJSONFile('attendance.json', attendance);
    res.send('Attendance for today has been started');
};

export const addAttendance = (req, res) => {
    let students = readJSONFile('students.json');
    let student = students.find(s => s.card === req.body.rfid);
    if (!student) return res.send("Denied");
    let attendance = readJSONFile('attendance.json');
    let todayRecord = attendance.find(record => record.Date === getCurrentDate());
    if (!todayRecord) return res.send("Attendance not started for today");
    if (todayRecord.Record.some(record => record.roll === student.roll)) {
        return res.send(`${student.fname} ${student.lname} has already been marked present`);
    }
    todayRecord.Record.push({ ...student, time: getCurrentTime() });
    writeJSONFile('attendance.json', attendance);
    res.send("Attendance recorded");
};
