const util = require('node:util');
const mysql = require('mysql2/promise');

let connection;

async function initDB() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        console.log("Base de datos conectada");
    }
    return connection;
}

module.exports = initDB;

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
    
// });
// connection.query = util.promisify(connection.query);
// module.exports = connection;