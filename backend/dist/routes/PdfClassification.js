import express from 'express';
import multer from 'multer';
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file received" });
        }
        console.log("Received PDF:", req.file.originalname);
        res.status(200).json({ message: "Upload successful" });
    }
    catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
export default router;
