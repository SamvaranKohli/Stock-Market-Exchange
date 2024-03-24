const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {app, server} = require('./app');
const stockModel = require('./../models/stockModel');

const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

dotenv.config({path : './../config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('Connected'));

io.on('connection', (socket) => {
  console.log('A client connected'); // Log when a client connects

  // Example: Listen for database updates
  stockModel.watch().on('change', (change) => {
      console.log('Database updated');
      socket.emit('update', change); // Emit update event to connected clients
  });
});


port = 4000;
server.listen(port, ()=> {
    console.log("Sever started");
});