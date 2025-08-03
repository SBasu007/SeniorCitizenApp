import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import signUp from './routes/SignUp.js';
import chat from './routes/Chat.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/authSignUp', signUp);
app.use('/ai-chat', chat);
app.listen(3000, "0.0.0.0", () => {
    console.log("Backend working on port 3000");
});
