var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    shell = require('shelljs'),
    path = require('path');

http.createServer(function (req, res) {
  fs.readFile(path.normalize(__dirname + req.url), function (err,data) {
    if (err) {
      console.log(req.url);
      shell.mkdir('-p', path.normalize(path.dirname((__dirname + req.url))));
      const file = fs.createWriteStream(path.normalize(__dirname + req.url));
      console.log("downloading: " + "https://launchermeta.mojang.com" + (req.url).substring(1));
      const request = https.get(("https://launchermeta.mojang.com" + (req.url).substring(1)), function(response) {
        response.pipe(file);
      });
    }
    console.log("served file: " + path.normalize(__dirname + req.url));
    res.writeHead(200);
    res.end(data);
  });
}).listen(8081);
