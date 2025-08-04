import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import fs from 'fs';
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
<<<<<<< Updated upstream
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No file received" });
    }
    try {
        console.log("Received PDF:", file.originalname);
        // Read and parse the uploaded PDF
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);
        const textContent = pdfData.text;
        res.status(200).json({
            message: "Upload and parsing successful",
        });
    }
    catch (err) {
        console.error("Error parsing PDF:", err);
        res.status(500).json({ error: "Server error while parsing PDF." });
    }
=======
    router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
        if (!req.file) {
            console.log("No file uploaded.");
            return res.status(400).json({ error: "No file received" });
        }
        console.log("success");
        res.status(200).json({ message: "Upload success" });
    });
>>>>>>> Stashed changes
});
export default router;
