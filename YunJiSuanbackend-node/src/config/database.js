const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/questions.db');
const db = new Database(dbPath, { verbose: console.log });

module.exports = db; 