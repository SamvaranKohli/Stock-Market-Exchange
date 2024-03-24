const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');

const orderRouter = require('./../routes/orderRoutes');
const stockRouter = require('./../routes/stockRoutes');
const userRouter = require('./../routes/userRoutes');

const corsOptions ={
    origin:'*', 
    credentials:true,           
    optionSuccessStatus:200,
 }

const app = express();
// app.use(cors())

const options = {
    key: fs.readFileSync('./../https2/localhost.key'),
    cert: fs.readFileSync('./../https2/localhost.crt')
  };

const server = https.createServer(options, app);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'https://127.0.0.1:5500',
    credentials: true
}));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/stocks', stockRouter);
app.use('/api/v1/users', userRouter);

module.exports = {app, server};