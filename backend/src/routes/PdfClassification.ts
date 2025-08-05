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
        const prompt =  `You are a smart and medically aware assistant. Analyze the following text extracted from a medical report and return a JSON object in the following structure:

                            {
                            "findings_summary": "A brief, human-readable summary of the key medical findings.",
                            "parameters": {
                                "parameter_name": {
                                "value": "measured_value",
                                "unit": "unit_of_measurement",
                                "normal_range": "normal_range (mention 'standard' if assumed)",
                                "status": "normal / high / low "
                                },
                                ...
                            }
                            }

                            Your task is to:
                            1. **Correct any spelling or formatting errors** in the extracted text.
                            2. **Extract key medical parameters** (e.g., glucose, creatinine, hemoglobin), their values, and units.
                            3. For each parameter, provide:
                            - The **normal reference range** (use a medically accepted standard if not available in the report and indicate it as such).
                            - A **status** field indicating whether the value is normal, high, low, or unknown based on the normal range.
                            4. If a parameter has a **type** (e.g., "Fasting Glucose" vs. "Postprandial Glucose"), include that distinction.
                            5. If no valid medical parameters are detected, return parameters: {}.
                            6. Do not include irrelevant values or interpretations; focus strictly on medical parameters and their diagnostics.
                            
                            Return the response as raw JSON without any markdown or code block formatting.
                            ### Report:
                            ${textContent}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const outputText = response.text();

        // Parse outputText to get a proper JS object
        let parsed;
        try {
        parsed = JSON.parse(outputText);
        } catch (error) {
        console.error("Failed to parse JSON from model output:", error);
        return;
        }

        // Destructure parameters from parsed response
        const { parameters } = parsed;

        if (!parameters || typeof parameters !== 'object') {
        console.error("No valid parameters found in parsed output");
        return;
        }

        // Construct rows for Supabase
        const rows = Object.entries(parameters).map(([paramName, details]: [string, any]) => ({
        user_id: userId,
        parameter_name: paramName,
        value: details.value,
        unit: details.unit,
        normal_range: details.normal_range,
        status: details.status,
        created_at: new Date().toISOString(), 
        }));

        console.log(rows);


        res.status(200).json({
            message: "Upload and parsing successful",
        });
    } catch (err) {
        console.error("Error parsing PDF:", err);
        res.status(500).json({ error: "Server error while parsing PDF." });
    }
});

export default router;