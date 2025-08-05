import express, { Express } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import signUp from './routes/SignUp.js';
import chat from './routes/Chat.js';
import availableAmbulances from './routes/Ambulance.js';
import pdfHandle from './routes/PdfClassification.js';
import profile from './routes/Profile.js'; // Add this import
import recommendationsRoutes from './routes/recommendations';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/authSignUp', signUp);
app.use('/ai-chat', chat);
app.use('/available-ambulances', availableAmbulances);
app.use('/pdf', pdfHandle);
app.use('/profile', profile); // Add this route
app.use('/recommendations', recommendationsRoutes);
//test
app.get('/ping', (_, res) => res.send('pong'));

app.listen(3000, "0.0.0.0", () => {
    console.log("Backend working on port 3000");
});
