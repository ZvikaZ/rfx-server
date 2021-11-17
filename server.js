const http = require('http')
const fs = require('fs')
const qs = require('querystring');


function createCronTable() {
    let table = '<tbody id="cronCmdTableBody">\n'
    for (let i = 1; i <= 5; i++) {
        let row = '\t<tr>\n'
        // row += '\t\t<th scope="row">' + i + '</th>\n'

        // row += '                    <td>כל יום</td>\n' +
        //     '                    <td>23:00</td>\n' +
        //     '                    <td>מטבח מזרח</td>\n' +
        //     '                    <td>למטה</td>'

        row += '\t</tr>\n'
        table += row
    }
    table += '</tbody>'
    return table
}

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
                res.end('OK');
            } else {
                console.log("Failed to run somfy.py")
                res.end('Failed')
            }
        });
    } else {
        if (req.url == "/")
            fs.createReadStream('index.html').pipe(res)
        else if (req.url == "/cron_table.html")
            res.end(createCronTable())
    }
})

server.listen(8080)
