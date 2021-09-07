const https = require('https');

allUrls = []

function lookForUrls(json) {
    for (x in json) {
        if (x == "hash") {
            resourceUrl = "http://resources.download.minecraft.net/" + json[x][0] + json[x][1] + "/" + json[x]
            allUrls.push(resourceUrl)
            console.log(resourceUrl)
        }

        if (typeof json[x] == 'object') {
            lookForUrls(json[x])
        } else if (typeof json[x] == 'string') {
            if ((json[x].startsWith("https://") || json[x].startsWith("http://")) && !(json[x].startsWith("https://launcher.mojang.com"))) {
                console.log(json[x])
                allUrls.push(json[x])
                if (json[x].endsWith(".json")) {
                    getAndParseJson(json[x])
                }
            }
        }
    }
    // console.log(allUrls.length)
}

function getAndParseJson(url) {
    https.get(url,(res) => {
        let body = "";
    
        res.on("data", (chunk) => {
            body += chunk;
        });
    
        res.on("end", () => {
            try {
                let json = JSON.parse(body);
                lookForUrls(json)
                // do something with JSON
            } catch (error) {
                console.error(error.message);
            };
        });
    
    }).on("error", (error) => {
        console.error(error.message);
    });
} 

let url = "https://launchermeta.mojang.com/mc/game/version_manifest.json";
getAndParseJson(url)

// run within files/
// xargs -n 1 -P 8 wget -np -r -nc < ../urls.list