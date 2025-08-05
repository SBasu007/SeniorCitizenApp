import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    const file = req.file;
    const userId = req.body.user_id;

    if (!file) {
        return res.status(400).json({ error: "No file received" });
    }

    try {
        console.log("Received PDF:", file.originalname);

        // Read and parse the uploaded PDF
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);
        const textContent = pdfData.text;
        
        //Summarization
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt =  `You are a smart medical assistant. Carefully analyze the following pdf-extracted medical report and return the output in JSON format with this structure:
        {
        "findings_summary": "A short, human-readable summary of key findings",
        "parameters": {
            "parameter_name": {
            "value": "measured_value",
            "unit": "measurement_unit",
            "normal_range": "normal_range_if_available_or_from_standard (standard used)",
            "status": "normal / high / low"
            // ... more parameters
        }
        }

        Your tasks:
        1. Correct any spelling or formatting mistakes.
        2. Identify only the key medical parameters, units, and values.
        3. Specify the status based on the normal range of the corresponding parameter.
        4. If the normal range is not present in the input, provide a standard medically accepted normal range and mention it in brackets like this: "70–110 mg/dL (standard)".
        5. Based on the normal range and value, return a status: normal, high, low, abnormal, or unknown.
        6. If no valid medical parameters are found, return an empty parameters object.
        7. For reports such as glucose, please try to mention the type, like for glucose there is Fasting and PP, likewise.

        Report to analyze:
        ${textContent}`;

        const result = await model.generateContent(prompt);
        const response = result.response;

        //Insert to supabase
        const rows = Object.entries(response).map(([paramName, details]) => ({
            user_id: userId,
            parameter_name: paramName,
            value: details.value,
            unit: details.unit,
            normal_range: details.normal_range,
            status: details.status,
            created_at: "today"
        }));
        console.log(rows)



        res.status(200).json({
            message: "Upload and parsing successful",
        });
    } catch (err) {
        console.error("Error parsing PDF:", err);
        res.status(500).json({ error: "Server error while parsing PDF." });
    }
});

export default router;