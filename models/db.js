const mysql = require('mysql2');

// Configurações de conexão
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',        // Substitua pelo usuário do MySQL
    password: 'Ray8181@',      // Substitua pela senha do MySQL
    database: 'Transcritor',    // Nome do banco de dados
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exporta a conexão como uma Promise para facilitar o uso
const db = pool.promise();

module.exports = db;
