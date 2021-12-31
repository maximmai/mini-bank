/**
 * invoice schema
 *
 */

const sql = `
 CREATE TABLE IF NOT EXISTS invoices (
 id INT AUTO_INCREMENT PRIMARY KEY,
 recipient_account_id INT,
 payer_account_id INT,
 amount INT NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 paid_at TIMESTAMP
 )  ENGINE=INNODB;
`;

const schema = {
    _id: "",
    amount: 0,
    recipientAccountId: "",
    payerAccountId: "",
    createdAt: new Date(),
    paidAt: new Date(),
}

module.exports = {
    schema,
    sql
}