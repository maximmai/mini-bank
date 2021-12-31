/**
 * account schema
 *
 */

const sql = `
 CREATE TABLE IF NOT EXISTS accounts (
 id INT AUTO_INCREMENT PRIMARY KEY ,
 name VARCHAR(255) NOT NULL,
 balance INT NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )  ENGINE=INNODB;
`;

const schema = {
    balance: 0,
    _id: "",
    name: "",
    createdAt: new Date()
}

module.exports = {
    schema,
    sql
};