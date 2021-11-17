const http = require('http')
const fs = require('fs')
const qs = require('querystring');


const server = http.createServer((req, res) => {
    res.writeHead(200, {'content-type': 'text/html'})

    if (req.method == "POST") {
        var postdata = "";
        req.on('data', function (postdataChunk) {
            postdata += postdataChunk;
        });

        req.on('end', function () {
            var paramstring = qs.parse(postdata)
            console.log(paramstring.room + " " + paramstring.cmd)

            const {spawnSync} = require('child_process');
            const exec = spawnSync('/home/zvika/RFXCMD/somfy.py', [paramstring.room, paramstring.cmd]);

            if (exec.status == 0) {
                console.log(`stderr: ${exec.stderr.toString()}`);
                console.log(`stdout: ${exec.stdout.toString()}`);
            } else {
                console.log("Failed to run somfy.py")
            }
        });
    }

    fs.createReadStream('index.html').pipe(res)
})

server.listen(8080)
