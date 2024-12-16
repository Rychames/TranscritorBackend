const express = require('express');
const multer = require('multer');
const Transcription = require('../models/transcription');
const db = require('../models/db'); // Importando a conexão do banco de dados

const router = express.Router();

// Configuração do multer para armazenar arquivos em memória
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10 MB
});

// Lista todas as transcrições
router.get('/', async (req, res) => {
    try {
        const transcriptions = await Transcription.getAll();
        res.json(transcriptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Busca uma transcrição pelo ID
router.get('/:id', async (req, res) => {
    try {
        const transcription = await Transcription.getById(req.params.id);

        if (!transcription) {
            return res.status(404).json({ error: 'Transcription not found' });
        }
        
        if (transcription.audio) {
            const audioUrl = `/audio/${transcription.id}`; // URL do áudio no backend
            transcription.audio_url = audioUrl; // Adiciona a URL ao objeto de retorno
        }
        
        res.json(transcription);
    } catch (error) {
        console.error('Erro ao buscar transcrição:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Rota para obter o áudio da transcrição
router.get('/:id/audio', async (req, res) => {
    try {
        // Consulta o áudio do banco de dados pelo ID
        const [result] = await db.query('SELECT audio FROM transcriptions WHERE id = ?', [req.params.id]);

        if (result.length === 0 || !result[0].audio) {
            return res.status(404).json({ message: 'Áudio não encontrado' });
        }

        const audioBuffer = result[0].audio;

        // Configura os cabeçalhos para streaming
        res.set({
            'Content-Type': 'audio/mpeg', // Ajuste o tipo conforme o formato do áudio (ex.: 'audio/wav')
            'Content-Length': audioBuffer.length,
        });

        // Envia o áudio diretamente
        res.send(audioBuffer);
    } catch (error) {
        console.error('Erro ao retornar áudio:', error);
        res.status(500).json({ message: 'Erro ao carregar áudio' });
    }
});

// Cria uma nova transcrição
router.post('/', upload.single('audio'), async (req, res) => {
    console.log('Dados recebidos no backend:', req.body); // Logando os dados do corpo
    console.log('Arquivo de áudio recebido:', req.file); // Logando o arquivo recebido

    try {
        const audioFile = req.file ? req.file.buffer : null; // Obtendo o arquivo de áudio
        const newTranscription = {
            ...req.body,
            audio: audioFile // Adicionando o áudio ao corpo da requisição
        };

        const result = await Transcription.create(newTranscription);
        res.status(201).json({ id: result.insertId, ...newTranscription });
    } catch (err) {
        console.error('Erro ao criar a transcrição:', err); // Logando o erro
        res.status(500).json({ error: err.message });
    }
});

// Atualiza uma transcrição
router.put('/:id', upload.single('audio'), async (req, res) => {
    try {
        const audioFile = req.file ? req.file.buffer : null; // Obtém o arquivo de áudio
        const updatedData = {
            ...req.body,
            audio: audioFile, // Inclui o áudio na atualização
        };

        const result = await Transcription.update(req.params.id, updatedData);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transcription not found' });
        }
        res.json({ message: 'Transcription updated successfully' });
    } catch (err) {
        console.error('Erro ao atualizar transcrição:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Exclui uma transcrição
router.delete('/:id', async (req, res) => {
    try {
        const result = await Transcription.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transcription not found' });
        }
        res.json({ message: 'Transcription deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;