var https = require('https');
var httpProxy = require('http-proxy');
var seaport = require('seaport');
var ports = seaport.connect('localhost', 9090);
const fs = require('fs');
const path = require('path');

var i = -1;


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

    i = (i + 1) % addresses.length;

    //splitter host og omvender rækkefølge, så det første array element blir den sidste.
	var host = addresses[i].host.split(":").reverse() [0];
    var port = addresses[i].port;
    
    //proxyer serveren med de specificerede options

    proxy.web(req, res, {target: "https://" + host +  ":" + port, secure: false})
});

// lytter på server 8080
server.listen(8080, function(){
    console.log(`load-balancer lytter på`, 8080)
});