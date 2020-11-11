
//i added this code to make my errors look better in mongo:)
// also my database is hosted on mongodb atlas as i think its a good thing to practice rather than localhost 

//require mongoose module
var mongoose = require('mongoose');

//require chalk module to give colors to console text
var chalk = require('chalk');


var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;

//export this function and imported by server.js
module.exports = function() {

    mongoose.connect("mongodb+srv://dbManager:Z9Q8AWu6tX5pH4Q6@cluster0.eu2r7.mongodb.net/bankingDb?authSource=admin&replicaSet=atlas-elolcr-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true");

    mongoose.connection.on('connected', function(){
        console.log(connected("Mongoose default connection is open to ", dbURL));
    });

    mongoose.connection.on('error', function(err){
        console.log(error("Mongoose default connection has occured " + err));
    });

    mongoose.connection.on('disconnected', function(){
        console.log(disconnected("Mongoose default connection is disconnected"));
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log(termination("Mongoose default connection is disconnected due to application termination"));
            process.exit(0)
        });
    });
}


let connection;

const getConnection = async () => {
    if (!connection) {
        // 2. Insert the correct db url
        // Your URL should be mongodb://localhost/<database name>, ie. 
        
     //   mongodb:"mongodb+srv://dbManager:Z9Q8AWu6tX5pH4Q6@cluster0.eu2r7.mongodb.net/bankingDb?authSource=admin&replicaSet=atlas-elolcr-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"

        connection = await mongoose.connect('mongodb+srv://dbManager:Z9Q8AWu6tX5pH4Q6@cluster0.eu2r7.mongodb.net/bankingDb?authSource=admin&replicaSet=atlas-elolcr-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    }
    return connection;
}


module.exports = {
    getConnection: getConnection
}


