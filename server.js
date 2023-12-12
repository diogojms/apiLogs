const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
const Logs = require('./Models/logs')
const moment = require('moment')
moment.locale("en")
var amqp = require('amqplib/callback_api');

require('dotenv').config();

const uri = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;
mongoose.connect(uri).then(() => { 
    console.log("Successfully connected to MongoDB.");
}).catch(err => {
    console.error("Connection error", err);
}) 


// App
const app = express()
//app.use(bodyParser.json())
//app.use("/logs",require('./routes/loggerRoutes.js'))
//app.use('/', express.static(path.join(__dirname, 'static')))
async function LogRegisto(message) {
  const {Level, Action, Description, User} = message
  const LogMoment = Date.now()

  const LogCreated = await Logs.create({
      Level,
      Action,
      Description,
      User,
      LogMoment
  })
}
console.log(`Connecting to RabbitMQ server: ${process.env.LOGS_URI}`);
amqp.connect(`amqp://${process.env.LOGS_URI}`, function(error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'tasks';

        channel.assertQueue(queue, {
            durable: true
        });

        channel.consume(queue, function(msg) {
            console.log(JSON.parse(msg.content));
            LogRegisto(JSON.parse(msg.content))
        }, {
            noAck: true
        });
    });
});

let port=8082;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
