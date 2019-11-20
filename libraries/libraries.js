var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    shell = require('shelljs'),
    path = require('path');

http.createServer(function (req, res) {
  fs.readFile(__dirname + req.url, function (err,data) {
    if (err) {
      console.log(req.url);
      shell.mkdir('-p', path.normalize(path.dirname((__dirname + req.url))));
      const file = fs.createWriteStream(path.normalize(__dirname + req.url));
      const request = https.get(("https://libraries.minecraft.net/" + (req.url).substring(1)), function(response) {
        response.pipe(file);
      });
    }
    console.log("served file: " + req.url);
    res.writeHead(200);
    res.end(data);
  });
}).listen(8083);
