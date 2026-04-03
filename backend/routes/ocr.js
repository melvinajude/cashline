const express = require('express');
const multer  = require('multer');
const axios   = require('axios');
const FormData= require('form-data');
const authMW  = require('../middleware/authMiddleware');

const router  = express.Router();
// Store uploads in memory only — never written to disk
const upload  = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/ocr/scan
router.post('/scan', authMW, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename:    req.file.originalname || 'upload.png',
      contentType: req.file.mimetype,
    });
    form.append('language', 'eng');
    form.append('isOverlayRequired', 'false');
    form.append('detectOrientation', 'true');
    form.append('scale', 'true');

    const response = await axios.post('https://api.ocr.space/parse/image', form, {
      headers: {
        ...form.getHeaders(),
        apikey: process.env.OCR_SPACE_KEY,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error('[OCR proxy error]', err.message);
    res.status(500).json({ error: 'OCR processing failed' });
  }
});

module.exports = router;