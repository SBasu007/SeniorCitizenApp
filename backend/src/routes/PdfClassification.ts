import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    const file = req.file;
    console.log(file)
})

export default router;