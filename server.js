const http = require('http')
const fs = require('fs')
const qs = require('querystring');

let cronTable = ""

function createCronTable() {
    try {
        require('crontab').load(function (err, crontab) {
            let table = '<tbody id="cronCmdTableBody">\n'
            var jobs = crontab.jobs({command: '/home/zvika/RFXCMD/somfy.py'});
            let i = 0
            for (let job of jobs) {
                if (job.isValid()) {
                    i++
                    exec = job.command().split(' ')
                    let room
                    switch (exec[1]) {
                        case 'UP_OUT':
                            room = 'מרפסת עליונה'
                            break
                        case 'KITCHEN1':
                            room = 'מטבח דרום'
                            break
                        case 'KITCHEN2':
                            room = 'מטבח מזרח'
                            break
                        case 'SALON_SMALL':
                            room = 'סלון חלון'
                            break
                        case 'SALON_OUT':
                            room = 'סלון למרפסת'
                            break
                        case 'PARENTS':
                            room = 'הורים'
                            break
                        case 'ALL':
                            room = '(קבוצה) הכל'
                            break
                        case 'PUBLIC':
                            room = '(קבוצה) סלון מטבח'
                            break
                        case 'PUBLIC_SMALL':
                            room = '(קבוצה) חלונות סלון מטבח'
                            break
                        default:
                            room = exec[1]
                    }
                    let cmd
                    switch (exec[2]) {
                        case 'UP':
                        case '0':
                            cmd = 'למעלה'
                            break
                        case 'DOWN':
                        case '100':
                            cmd = 'למטה'
                            break
                        default:
                            cmd = exec[2]
                    }
                    let day
                    switch (job.dow().toString()) {
                        case '0':
                            day = "ראשון"
                            break
                        case '1':
                            day = "שני"
                            break
                        case '2':
                            day = "שלישי"
                            break
                        case '3':
                            day = "רביעי"
                            break
                        case '4':
                            day = "חמישי"
                            break
                        case '5':
                            day = "שישי"
                            break
                        case '6':
                            day = "שבת"
                            break
                        case '*':
                            day = "כל יום"
                            break
                        default:
                            day = job.dow().toString()
                    }

                    let row = '\t<tr>\n'
                    row += '\t\t<th scope="row">' + i + '</th>\n'
                    row += '\t\t<td>' + day + '</td>\n'
                    row += '\t\t<td>' + job.hour() + ":" + job.minute() + '</td>\n'
                    row += '\t\t<td>' + room + '</td>\n'
                    row += '\t\t<td>' + cmd + '</td>\n'
                    row += '\t\t<td>' + job.comment() + '</td>\n'
                    // console.log(day + ". " + job.hour() + ":" + job.minute() + ", " + room + " - " + cmd + " //" + job.comment());
                    row += '\t</tr>\n'
                    table += row
                }
            }
            table += '</tbody>'
            cronTable = table
        })
    } catch (e) {
        console.log(e)
    }


}

const server = http.createServer((req, res) => {
    createCronTable()  //TODO should be called only when needed, with some promise mechanism, or whatever JS syncing
    let reqKind = req.url.split('.')
    reqKind = reqKind[reqKind.length - 1]
    let resKind = "html";
    if (reqKind == "css")
        resKind = "css"
    res.writeHead(200, {'content-type': 'text/' + resKind})

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
        if (req.url == "/") {
            fs.createReadStream('index.html').pipe(res)
        } else if (req.url == "/cron_table.html") {
            res.end(cronTable)
        } else {
            fs.createReadStream(req.url.slice(1)).pipe(res)
        }
    }
})

server.listen(8080)
