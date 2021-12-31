const {createDBConnection, wrapResponse} = require("./database/utils");

const {
    createAccount,
    getAccount,
    deposit,
    withdraw,
    transferBalance,
    createInvoice,
    payInvoice,
    getInvoice
} = require("./lib");

const handlerCreateAccount = async (req, res) => {
    const connection = await createDBConnection();
    const result = await createAccount(connection, req.body.name);
    const response = wrapResponse(result);
    res.send(response);
}

const handlerGetAccount = async (req, res) => {
    const connection = await createDBConnection();
    const [account, ] = await getAccount(connection, req.params.id);
    const response = wrapResponse(account);
    res.send(response);
}

const handlerDeposit = async (req, res) => {
    const amount = parseFloat(req.body.amount);
    const id = req.params.id;
    const connection = await createDBConnection();
    const result = await deposit(connection, id, amount);
    const response = wrapResponse(result);
    res.send(response);
}

const handlerWithdraw = async (req, res) => {
    const amount = parseFloat(req.body.amount);
    const id = req.params.id;
    const connection = await createDBConnection();
    const result = await withdraw(connection, id, amount);
    const response = wrapResponse(result);
    res.send(response);
}

const handlerTransfer = async (req, res) => {
    const sourceAccountId = req.body.sourceAccountId;
    const destAccountId = req.body.destAccountId;
    const amount = parseFloat(req.body.amount);
    const connection = await createDBConnection();
    const result = await transferBalance(connection, sourceAccountId, destAccountId, amount);
    const response = wrapResponse(result);
    res.send(response);
}

const handlerCreateInvoice = async (req, res) => {
    const { recipientAccountId, amount } = req.body;
    const connection = await createDBConnection();
    const result = await createInvoice(connection, recipientAccountId, amount);
    const response = wrapResponse(result);
    res.send(response);
}

const handlerPayInvoice = async (req, res) => {
    const id = req.params.id;
    const payerAccountId = req.body.payerAccountId;
    const connection = await createDBConnection();
    const result = await payInvoice(connection, id, payerAccountId);
    const response = wrapResponse(result);
    res.send(response);
}

const handlerGetInvoice = async (req, res) => {
    const connection = await createDBConnection();
    const [invoice, ] = await getInvoice(connection, req.params.id);
    const response = wrapResponse(invoice);
    res.send(response);
}

module.exports = {
    handlerCreateAccount,
    handlerGetAccount,
    handlerDeposit,
    handlerWithdraw,
    handlerTransfer,
    handlerCreateInvoice,
    handlerPayInvoice,
    handlerGetInvoice
}