import express from "express";
import cors from 'cors';
import signUp from './routes/SignUp.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/authSignUp', signUp);
app.listen(3000, "0.0.0.0", () => {
    console.log("Backend working");
});
