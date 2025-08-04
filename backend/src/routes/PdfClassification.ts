import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        console.log("No file uploaded.");
        return res.status(400).json({ error: "No file received" });
    }

    console.log("success");
    res.status(200).json({ message: "Upload success" });
});
})

export default router;