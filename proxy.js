const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs')
const path = require('path');
const https = require('https'); // or 'https' for https:// URLs
// const { url } = require('inspector');

const app = express();

const filter = function (pathname, req) {
  if (pathname[0] == "/") {
    pathname = "." + pathname
  }
  exists = fs.existsSync(pathname)

  if(!exists) {
    try {
      // let's download the file
      url = pathname
      url = url.replace("./launchermeta", 'https://launchermeta.mojang.com')
      url = url.replace("./resources", 'https://resources.download.minecraft.net')
      url = url.replace("./libraries/", 'https://libraries.minecraft.net/')
      
      console.log("Creating directory: " + path.dirname(pathname))
      fs.mkdirSync(path.dirname(pathname), { recursive: true })    
      
      var file = fs.createWriteStream(pathname);
      var request = https.get(url, function(response) {
        response.pipe(file);
      });

      console.log("Downloaded: " + url)
    } catch (e) {
      console.log("Caught Exception: " + e)
    }
  }

  console.log(pathname + ": " + exists)
  return !exists
};

const options = {
    target: 'https://www.google.com', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
      '^/google': '/', // remove base path
    }
};

const launchermetaOptions = {
    target: 'https://launchermeta.mojang.com', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
      '^/launchermeta': '/', // remove base path
    }
};

const resourcesOptions = {
    target: 'https://resources.download.minecraft.net', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
      '^/resources': '/', // remove base path
    }
};
  
const librariesOptions = {
    target: 'https://libraries.minecraft.net/', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
      '^/libraries': '/', // remove base path
    }
};

app.use('/launchermeta', createProxyMiddleware(filter, launchermetaOptions));
app.use('/resources', createProxyMiddleware(filter, resourcesOptions));
app.use('/libraries', createProxyMiddleware(filter, librariesOptions));

app.use(express.static('./'))

rocess.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

app.listen(80)
