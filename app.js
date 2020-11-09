const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const https = require('https');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
var http = require('http')
var seaport = require('seaport')
const ports = seaport.connect('localhost', 9090);



//Added Json Body-parser
app.use(bodyParser.json());

//Import Routes
const accountRoute = require('./routes/accounts');
const db = require('./db');
app.use('/accounts', accountRoute)


/*
//get id 
app.get('/:id', (req, res) => {
    res.send()
})
*/

//finds the private key and certificate
var httpsServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
    }, app);


//Start listening
httpsServer.listen(ports.register('server'), () => {
    db.getConnection().then(() => {
        console.log("Database connected and ready to go!")
    })
    console.log('Server listening on', httpsServer.address().port);
 });

//Initial route
app.get('/', (req, res) => {
    res.send('Welcome to the banking app' + ' on port' + ' : ' + httpsServer.address().port);
});
