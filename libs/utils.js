const mysql = require("mysql2/promise");

/**
 * Make a models connection. The variable can be configured in `.env` under the root folder.
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

/**
 * Determine if an object is a Error response.
 * @param obj
 * @returns {*}
 */
function isError(obj) {
    return obj.isError == true;
}

/**
 * Wrap the result in the response format.
 * @param result
 * @returns {{data: null, success: boolean, message: string}}
 */
function wrapResponse(result) {
    let success = true;
    let message = "OK";
    let data = result

    if (isError(result)) {
        success = false;
        message = result.err.message;
        data = null;
    }
    const response = {
        message,
        success,
        data
    }

    return response;
}

module.exports = {
    createDBConnection,
    wrapResponse
}