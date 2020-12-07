var https = require('https');
var httpProxy = require('http-proxy');
var seaport = require('seaport');
var ports = seaport.connect('localhost', 9090);
const fs = require('fs');
const path = require('path');
const { Console } = require('console');

var i = -1;

//The fs. readFileSync() method is an inbuilt application programming interface of fs module which is used to read the file and return its content.
var options = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))};

var proxy = httpProxy.createProxyServer({
});

var server = https.createServer(options, function(req, res) {
    //queryer seaport
    var addresses = ports.query('server');
    
    
    if (!addresses.length) {
        console.log('adress length is falsy');
        res.writeHead(200, {'Content-Type': 'text/plain'})
        res.end('service ikke tilgængelig');
        return; 
    }
    //sørger for at oprette de 3 servere, siger modulus dividere med i+1 og address.length
    i = (i + 1) % addresses.length;

	var host = addresses[i].host.split(":").reverse() [0];
    var port = addresses[i].port;

    //proxyer serveren med de specificerede options som object 
    proxy.web(req, res, {target: "https://" + host +  ":" + port, secure: false})
});

// lytter på server 8080
server.listen(8080, function(){
    console.log(`load-balancer lytter på`, 8080)
});

    // var host skal splittes og reverses fordi det er en ipv4 connection der skal forbindes med 
    // vores ipv6 socket, addressen skal derfor paddes fra 32 til 128 bit. Hvilket gir en ipv4 mapped ipv6 adresse
    // den er præfixet med ::ffff: som skal fjernes fra adressn for at den virker. hvorfor linje 37 er meget vigtig.