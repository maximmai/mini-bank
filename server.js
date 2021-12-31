require('dotenv').config();
const express = require('express');
const {
    handlerCreateAccount,
    handlerGetAccount,
    handlerDeposit,
    handlerWithdraw,
    handlerTransfer,
    handlerCreateInvoice,
    handlerPayInvoice,
    handlerGetInvoice
} = require('./handlers');

const API_PORT = 3000;
const API_PREFIX = '/api';

const app = express();
app.use(express.json());

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

app.listen(API_PORT, () => {
    console.log(`Banking app listening at http://localhost:${API_PORT}`);
})