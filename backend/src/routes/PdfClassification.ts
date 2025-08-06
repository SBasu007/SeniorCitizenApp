import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import supabase from "../middleware/supabase.js";

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

    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(dataBuffer);
    const textContent = pdfData.text;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a smart and medically aware assistant. Analyze the following text extracted from a medical report and return a JSON object in the following structure:

                            {
                            "findings_summary": "A brief, human-readable summary of the key medical findings.1-2 short sentences",
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

    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch (error) {
      console.error("Failed to parse JSON from model output:", error);
      return res.status(500).json({ error: "Model returned invalid JSON." });
    }

    const { findings_summary,parameters } = parsed;

    if (!parameters || typeof parameters !== 'object' || Object.keys(parameters).length === 0) {
      console.error("No valid parameters found in parsed output");
      return res.status(500).json({ error: "Not a medical report." });
    }
     // Create a unique filename
const fileName = `${Date.now()}-${file.originalname}`;
const filePath = `pdfs/${fileName}`; 

// Upload to Supabase bucket
const { data: storageData, error: storageError } = await supabase
  .storage
  .from('report-pdf') // your bucket name
  .upload(filePath, fs.readFileSync(file.path), {
    contentType: 'application/pdf',
    upsert: false,
  });

if (storageError) {
  console.error("Failed to upload PDF to Supabase Storage:", storageError);
  return res.status(500).json({ error: "Failed to upload file to storage." });
}
// Construct public URL 
const { data: publicUrlData } = supabase
  .storage
  .from('report-pdf')
  .getPublicUrl(filePath);

const fileUrl = publicUrlData?.publicUrl || null;

    // Delete uploaded file to clean up
    fs.unlinkSync(file.path)
    

    //supabase insertion of record
  const { data: recordData, error: insertRecordError } = await supabase
  .from('records')  
  .insert({
    user_id: userId,
    summary: findings_summary,
    filename: fileName,
    file_url: fileUrl
  })
  .select('id') 
  .single();

  if (insertRecordError) {
  console.error("Failed to insert rows into Supabase:", insertRecordError);
  return res.status(500).json({ error: "Failed to save pdf data to database." });
}
  
  let record_id = recordData?.id;

  //construct the row insert
  const rows = Object.entries(parameters).map(([paramName, details]: [string, any]) => ({
      
      record_id:record_id,
      parameter_name: paramName,
      value: details.value,
      unit: details.unit,
      normal_range: details.normal_range,
      status: details.status,
    }));

    //supabase insertion of parameters
    const { data: insertData, error: insertError } = await supabase
  .from('health_parameters')  
  .insert(rows);

if (insertError) {
  console.error("Failed to insert rows into Supabase:", insertError);
  return res.status(500).json({ error: "Failed to save medical data to database." });
}

    return res.status(200).json({
      message: "Upload and parsing successful",
    });
  } catch (err) {
    console.error("Error parsing PDF:", err);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Server error while parsing PDF." });
    }
  }
});

export default router;