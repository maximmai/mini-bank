require('dotenv').config();
const express = require('express');

const { deposit, getAccount, withdraw, transferBalance, createAccount, createInvoice, payInvoice, getInvoice} = require('./lib');
const { createDBConnection, wrapResponse } = require('./database/utils');

const port = 3000;
const API_PREFIX = '/api';
const app = express();
app.use(express.json());

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
    const { receiverAccountId, amount } = req.body;
    const connection = await createDBConnection();
    const result = await createInvoice(connection, receiverAccountId, amount);
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

// Account related
app.post(`${API_PREFIX}/account/create`, handlerCreateAccount);
app.get(`${API_PREFIX}/account/:id`, handlerGetAccount);
app.post(`${API_PREFIX}/account/:id/deposit`, handlerDeposit);
app.post(`${API_PREFIX}/account/:id/withdraw`, handlerWithdraw);
app.post(`${API_PREFIX}/account/transfer`, handlerTransfer);


// Invoice related
app.post(`${API_PREFIX}/invoice/create`, handlerCreateInvoice);
app.post(`${API_PREFIX}/invoice/:id/pay`, handlerPayInvoice);
app.get(`${API_PREFIX}/invoice/:id`, handlerGetInvoice);


app.listen(port, () => {
    console.log(`Banking app listening at http://localhost:${port}`);
})