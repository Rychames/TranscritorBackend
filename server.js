const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const textToSpeechRoutes = require('./routes/textToSpeechRoutes');
const speechToTextRoutes = require('./routes/speechToTextRoutes');
const transcriptionRoutes = require('./routes/transcriptionsRoutes');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/api/text-to-speech', textToSpeechRoutes);
app.use('/api/speech-to-text', speechToTextRoutes);
app.use('/api/transcriptions', transcriptionRoutes);

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
