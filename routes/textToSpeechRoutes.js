const express = require('express');
const textToSpeech = require('../apis/textToSpeech');

const router = express.Router();

// Define a rota
router.post('/', async (req, res) => {
    const { text, language, voice } = req.body;

    try {
        const result = await textToSpeech(text, language, voice);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
