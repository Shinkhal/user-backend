
import express from 'express';
import multer from 'multer';
import path from 'path';
const router = express.Router();

// Setup storage destination and file naming convention
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  res.status(200).send({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`,
  });
});
export default router;
