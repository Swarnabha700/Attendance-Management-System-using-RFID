import express from 'express';
import cors from 'cors';
import router from './route.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// ✅ Configure CORS properly
app.use(cors({
    origin: 'http://localhost:5177', // Allow frontend
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Allow cookies & authentication headers
    allowedHeaders: 'Content-Type,Authorization',
}));

app.use(router);

app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
