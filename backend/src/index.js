import express from 'express';
import cors from 'cors';
import { corsOptions } from '../middleware/corsOptions.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './db/db.js';
import authRouter from '../routes/authRooutes.js';
import userRouter from '../routes/userRoutes.js';
import aiRouter from '../routes/aiRoutes.js';


const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
 

app.use(express.json());
app.use(cors(corsOptions));
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