const mysql = require("mysql2/promise");

/**
 *
 * @returns {Promise<*>}
 */
async function createDBConnection(){
    const connection = await mysql.createConnection({
        user : process.env.USERDB,
        password : process.env.PASSWORD,
        host : process.env.HOST,
        database : process.env.DATABASE,
        insecureAuth: true
    });
    return connection;
}

module.exports = {
    createDBConnection
}