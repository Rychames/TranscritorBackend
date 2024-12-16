const axios = require('axios');
require('dotenv').config();

const textToSpeech = async (text, language, voice) => {
    const options = {
        method: 'GET',
        url: `https://${process.env.RAPIDAPI_HOST_TEXT_TO_SPEECH}/`,
        params: {
            text,
            language,
            voice
        },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY_TEXT_TO_SPEECH,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST_TEXT_TO_SPEECH
        }
    };

    try {
        const response = await axios.request(options);
        return response.data; // Retorna os dados da API
    } catch (error) {
        throw new Error('Erro ao converter texto para fala: ' + error.message);
    }
};

module.exports = textToSpeech;
