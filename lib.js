/**
 *
 * @param connection
 * @param accountId
 * @param amount
 * @returns {Promise<{isError: boolean, err}>}
 */
async function deposit(connection, accountId, amount) {
    await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    console.log('Finished setting the isolation level to read committed');
    await connection.beginTransaction();
    try {
        await connection.execute('SELECT id, name FROM accounts WHERE id = ? FOR UPDATE', [accountId]);
        console.log(`Locked rows for accounts: ${accountId}`);
        const [account,] = await connection.execute('SELECT name, balance from accounts WHERE id = ?', [accountId]);
        const result = await connection.execute('UPDATE accounts SET balance=balance+? WHERE id = ?', [amount, accountId]);
        console.log(`Account balance updated`);
        await connection.commit();
        return result;
    } catch (err) {
        console.error(`Error occurred while withdrawing: ${err.message}`, err);
        connection.rollback();
        console.info('Rollback successful');
        return {isError: true, err};
    }
}

/**
 *
 * @param connection
 * @param accountId
 * @returns {Promise<void>}
 */
async function getAccount(connection, accountId) {
    try {
        const [result, ] = await connection.query('SELECT * FROM accounts WHERE id = ?', [accountId]);
        return result;
    } catch (err) {
        console.error(`Error occurred while transferring: ${err.message}`, err);
        console.info('Rollback successful');
        return err;
    }
}

/**
 *
 * @param connection
 * @param accountId
 * @param amount
 * @returns {Promise<{isError: boolean, err}>}
 */
async function withdraw(connection, accountId, amount) {
    await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    console.log('Finished setting the isolation level to read committed');
    await connection.beginTransaction();
    try {
        await connection.execute('SELECT id, name FROM accounts WHERE id = ? FOR UPDATE', [accountId]);
        console.log(`Locked rows for accounts: ${accountId}`);
        const [account,] = await connection.execute('SELECT name, balance from accounts WHERE id = ?', [accountId]);
        if (account.balance < amount) {
            throw new Error(`Account ${accountId} doesn't have enough funding`);
        }
        const result = await connection.execute('UPDATE accounts SET balance=balance-? WHERE id = ?', [amount, accountId]);
        console.log(`Account balance updated`);
        await connection.commit();
        return result;
    } catch (err) {
        console.error(`Error occurred while withdrawing: ${err.message}`, err);
        connection.rollback();
        console.info('Rollback successful');
        return {isError: true, err};
    }
}

/**
 * Subroutine to handle transfer between accounts
 * @param connection
 * @param sourceAccountId
 * @param destAccountId
 * @param amount
 * @returns {Promise<{sourceAccountUpdate: *, destAccountUpdate: *}>}
 * @private
 */
async function _transferBalance(connection, sourceAccountId, destAccountId, amount) {
    await connection.execute('SELECT id, name FROM accounts WHERE id IN (?, ?) FOR UPDATE', [sourceAccountId, destAccountId]);

    console.log(`Locked rows for accounts: ${sourceAccountId}, ${destAccountId}`);
    const [[sourceAccount,],] = await connection.execute('SELECT name, balance from accounts WHERE id = ?', [sourceAccountId]);
    if (sourceAccount.balance < amount) {
        throw new Error(`Source account ${sourceAccountId} doesn't have enough funding`);
    }
    const [[destAccount,],] = await connection.execute('SELECT name, balance from accounts WHERE id = ?', [destAccountId]);
    if (!destAccount) {
        throw new Error(`Destination account ${destAccountId} error`);
    }
    const sourceAccountUpdate = await connection.execute('UPDATE accounts SET balance=balance-? WHERE id = ?', [amount, sourceAccountId]);
    console.log(`Source account balance updated`);
    const destAccountUpdate = await connection.execute(`UPDATE accounts SET balance=balance+? WHERE id = ?`, [amount, destAccountId]);
    console.log(`Target account balance updated`);
    return {
        sourceAccountUpdate,
        destAccountUpdate
    }
}

/**
 * Main routine to handle transfer between accounts
 * @param connection
 * @param sourceAccountId
 * @param destAccountId
 * @param amount
 * @returns {Promise<{sourceAccountUpdate: *, destAccountUpdate: *}>}
 */
async function transferBalance(connection, sourceAccountId, destAccountId, amount) {
    await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    console.log('Finished setting the isolation level to read committed');
    //set wait timeout and lock wait timeout as per need.
    await connection.beginTransaction();
    try {
        const result = await _transferBalance(connection, sourceAccountId, destAccountId, amount);
        await connection.commit();
        return result;
    } catch (err) {
        console.error(`Error occurred while transferring: ${err.message}`, err);
        connection.rollback();
        console.info('Rollback successful');
        return {isError: true, err};
    }
}

/**
 * Create an account with the provided name
 * @param connection
 * @param name
 * @returns {Promise<*>}
 */
async function createAccount(connection, name) {
    try {
        const [result, ] = await connection.execute(`INSERT INTO accounts (name) VALUES (?)`, [name]);
        return result;
    } catch (err) {
        console.error(`Error occurred while creating account: ${err.message}`, err);
        return {isError: true, err};
    }

}

/**
 * Create an invoice, with recipient
 * @param connection
 * @param recipientAccountId
 * @param amount
 * @returns {Promise<*>}
 */
async function createInvoice(connection, recipientAccountId, amount) {
    try {
        const [result, ] = await connection.execute(`INSERT INTO invoices (recipient_account_id, amount) VALUES (?, ?)`, [recipientAccountId, amount]);
        return result;
    } catch (err) {
        console.error(`Error occurred while creating account: ${err.message}`, err);
        return {isError: true, err};
    }
}

async function payInvoice(connection, invoiceId, payerAccountId) {
    await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    console.log('Finished setting the isolation level to read committed');
    //set wait timeout and lock wait timeout as per need.
    await connection.beginTransaction();
    try {
        const [[invoice,], ] = await connection.execute('SELECT id, amount, recipient_account_id, paid_at FROM invoices WHERE id IN (?) FOR UPDATE', [invoiceId]);

        if (invoice.paid_at) {
            throw new Error(`Invoice has already been paid`);
        }
        const amount = invoice.amount;
        const sourceAccountId = payerAccountId;
        const destAccountId = invoice.recipient_account_id;

        await _transferBalance(connection, sourceAccountId, destAccountId, amount);

        const result = await connection.execute('UPDATE invoices SET paid_at=?, payer_account_id=? WHERE id = ?', [new Date(), payerAccountId, invoiceId]);
        console.log(`Invoice updated`);
        await connection.commit();
        return result;
    } catch (err) {
        console.error(`Error occurred while transferring: ${err.message}`, err);
        connection.rollback();
        console.info('Rollback successful');
        return {isError: true, err};
    }
}

async function getInvoice(connection, invoiceId) {
    try {
        const [result, ] = await connection.query('SELECT * FROM invoices WHERE id = ?', [invoiceId]);
        return result;
    } catch (err) {
        console.error(`Error occurred while transferring: ${err.message}`, err);
        console.info('Rollback successful');
        return {isError: true, err};
    }
}

module.exports = {
    deposit,
    getAccount,
    withdraw,
    transferBalance,
    createAccount,
    createInvoice,
    getInvoice,
    payInvoice
}