const db = require('./db');

const Transcription = {
    // Busca todas as transcrições
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM transcriptions');
        return rows;
    },

    // Busca uma transcrição pelo ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM transcriptions WHERE id = ?', [id]);
        return rows[0];
    },

    // Cria uma nova transcrição
    create: async (data) => {
        const result = await db.query('INSERT INTO transcriptions SET ?', [data]);
        return result[0];
    },

    // Atualiza uma transcrição
    update: async (id, data) => {
        const result = await db.query('UPDATE transcriptions SET ? WHERE id = ?', [data, id]);
        return result[0];
    },

    // Exclui uma transcrição
    delete: async (id) => {
        const result = await db.query('DELETE FROM transcriptions WHERE id = ?', [id]);
        return result[0];
    }
};

module.exports = Transcription;
