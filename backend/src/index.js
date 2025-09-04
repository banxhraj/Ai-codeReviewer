import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './db/db.js';
import authRouter from '../routes/authRooutes.js';
import userRouter from '../routes/userRoutes.js';
import aiRouter from '../routes/aiRoutes.js';


const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
 

const allowedOrigins = [
  'httpAccess-Control-Allow-Origin: https://ai-code-reviewer-1cys.vercel.app',
  'httpAccess-Control-Allow-Origin: *',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(express.json());
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(cookieParser());

//Api endpoints
app.get('/', (req, res) => {
  res.send('Welcome to the User Authentication API');   
});

app.use('/api/auth',authRouter);

app.use('/api/user', userRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});