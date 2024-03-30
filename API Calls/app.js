const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const http = require('http');

const orderRouter = require('./../routes/orderRoutes');
const stockRouter = require('./../routes/stockRoutes');
const userRouter = require('./../routes/userRoutes');
const positionRouter = require('./../routes/positionRoutes');

const app = express();
app.use(cors());

const options = {
    key: fs.readFileSync('./../https2/localhost.key'),
    cert: fs.readFileSync('./../https2/localhost.crt')
  };

const server = http.createServer(app);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//     origin: 'http://127.0.0.1:5500'
// }));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next();
});

app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/stocks', stockRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/positions', positionRouter);

module.exports = {app, server};