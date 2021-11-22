// TODOs:
// Write readme (mention https://github.com/mfreeborn/heliocron)
// Use config instead of hard wired html and js names
// Allow up or down for k seconds

const http = require('http')
const fs = require('fs')
const qs = require('querystring');
const {v4: uuidv4} = require('uuid');


const commandBase = '/home/zvika/RFXCMD/somfy.py'


function createCronTable(cb) {
    try {
        require('crontab').load(function (err, crontab) {
            let jobs = crontab.jobs({command: commandBase});
            let rows = []
            for (let job of jobs) {
                if (job.isValid()) {
                    exec = job.command().split(' ')
                    if (exec[0] === 'heliocron')
                        exec.splice(0, 7)    // delete first 7 items
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
                    let time
                    if (!job.command().toString().includes('heliocron')) {
                        // const time
                        time = job.hour().toString() + ":" + job.minute().toString().padStart(2, '0')
                    } else {
                        let heliocron_params = job.command().toString().split(' ')
                        let evnt = heliocron_params[3]
                        if (evnt == 'sunrise')
                            time = 'ז'
                        else if (evnt == 'sunset')
                            time = 'ש'
                        else
                            console.log('unexpected heliocron event: ' + evnt)
                        let minutes = heliocron_params[5].split(':')[0]
                        if (minutes.charAt(0) == '-')
                            time += '-' + minutes.substring(1)
                        else
                            time += '+' + minutes
                    }

                    let metadata = qs.parse(job.comment())
                    let comment = 'comment' in metadata ? metadata.comment : ''
                    let uuid = 'uuid' in metadata ? metadata.uuid : 'null'
                    let row = '\t<tr>\n'
                    row +=
                        '\t\t<th scope="row">' +
                        '<div class="row-container">\n' +
                        '<div class="text row-text" id="textRow1">RUNNING-INDEX-I</div>\n' +
                        '<button type="button" class="btn btn-danger btn-sm row-del-button" id="delButton1" onclick="deleteRow(RUNNING-INDEX-I' + ", '" + uuid + "'" + ')">מחק</button>' +
                        '</div>\n' +
                        '</th>'
                    row += '\t\t<td>' + day + '</td>\n'
                    row += '\t\t<td>' + time + '</td>\n'
                    row += '\t\t<td>' + room + '</td>\n'
                    row += '\t\t<td>' + cmd + '</td>\n'
                    row += '\t\t<td>' + comment + '</td>\n'
                    row += '\t</tr>\n'
                    rows.push({
                        day: job.dow().toString(),
                        hour: job.hour().toString(),
                        minute: job.minute().toString(),
                        row: row
                    })
                }
            }
            rows.sort((a, b) => {
                if (a.day < b.day)
                    return -1
                else if (a.day > b.day)
                    return 1
                else if (a.hour - b.hour != 0)
                    return a.hour - b.hour
                else
                    return a.minute - b.minute
            })

            let table = '<tbody id="cronCmdTableBody">\n'
            let i = 0
            for (let row of rows) {
                i++
                table += row.row.replace(/RUNNING-INDEX-I/g, i)
            }
            table += '</tbody>'
            cb(table)
        })
    } catch (e) {
        if (e.message == "process.getuid is not a function") {
            console.log("crontab not working")
            let table = '<tbody id="cronCmdTableBody">\n' +
                '<tbody id="cronCmdTableBody">\n' +
                '\t<tr>\n' +
                '\t\t<th scope="row">' +
                '<div class="row-container">\n' +
                '<div class="text row-text" id="textRow1">1</div>\n' +
                '<button type="button" class="btn btn-danger btn-sm row-del-button" id="delButton1" onclick="deleteRow(1)">מחק</button>' +
                '</div>\n' +
                '</th>' +
                '\t\t<td>שבת</td>\n' +
                '\t\t<td>7:10</td>\n' +
                '\t\t<td>הורים</td>\n' +
                '\t\t<td>83</td>\n' +
                '\t\t<td>מזויף!</td>\n' +
                '\t</tr>\n' +
                '\t<tr>\n' +
                '\t\t<th scope="row">' +
                '<div class="row-container">\n' +
                '<div class="text row-text" id="textRow2">2</div>\n' +
                '<button type="button" class="btn btn-danger btn-sm row-del-button" id="delButton2" onclick="deleteRow(2)">מחק</button>' +
                '</div>\n' +
                '</th>' +
                '\t\t<td>שבת</td>\n' +
                '\t\t<td>7:15</td>\n' +
                '\t\t<td>הורים</td>\n' +
                '\t\t<td>למטה</td>\n' +
                '\t\t<td>מזויף!</td>\n' +
                '\t</tr>\n' +
                '\t<tr>\n' +
                "</tbody>"
            table += '</tbody>'
            cb(table)
        } else
            console.log(e)
    }


}

const server = http.createServer((req, res) => {
    let reqKind = req.url.split('.')
    reqKind = reqKind[reqKind.length - 1]
    let resKind = "html";
    if (reqKind == "css")
        resKind = "css"
    res.writeHead(200, {'content-type': 'text/' + resKind})

    if (req.method == "POST") {
        let postdata = "";
        req.on('data', function (postdataChunk) {
            postdata += postdataChunk;
        });

        req.on('end', function () {
            console.log(req.url)
            let paramstring = qs.parse(postdata)

            if (req.url == "/index.html") {
                console.log(paramstring.room + " " + paramstring.cmd)
                const {spawnSync} = require('child_process');
                const exec = spawnSync(commandBase, [paramstring.room, paramstring.cmd]);

                if (exec.status == 0) {
                    console.log(`stderr: ${exec.stderr.toString()}`);
                    console.log(`stdout: ${exec.stdout.toString()}`);
                    res.end('OK');
                } else {
                    console.log("Failed to run somfy.py")
                    res.end('Failed')
                }
            } else if (req.url == "/add_row_to_cron.html") {
                console.log("add: ")
                console.log(paramstring)
                let command = commandBase + " " + paramstring.room + " " + paramstring.percent
                if (paramstring.timeKind != 'constTime') {
                    let event = paramstring.timeKind.includes('Sunrise') ?
                        'sunrise' :
                        'sunset'
                    let offset = paramstring.time + ':0'
                    if (paramstring.timeKind.includes('before'))
                        offset = '-' + offset
                    command = 'heliocron wait --event ' + event + ' --offset ' + offset + ' && ' + command
                }
                console.log(command)
                try {
                    require('crontab').load(function (err, crontab) {
                        let job = crontab.create(command, null, "uuid=" + uuidv4() + "&comment=" + paramstring.comment);
                        if (job == null) {
                            console.log('failed to create job');
                            res.end('Failed')
                        } else {
                            job.dow().on(paramstring.day);
                            if (paramstring.timeKind == 'constTime') {
                                console.log('constTime')
                                job.hour().at(paramstring.time.split(':')[0]);
                                job.minute().at(paramstring.time.split(':')[1]);
                            } else if (paramstring.timeKind.includes('Sunrise')) {
                                job.hour().at(2);
                                job.minute().at(0);
                            } else if (paramstring.timeKind.includes('Sunset')) {
                                job.hour().at(13);
                                job.minute().at(0);
                            } else {
                                console.log("Unexpected timeKind: " + paramstring.timeKind)
                            }
                            crontab.save(function (err, crontab) {
                                console.log(err)
                                res.end(err)
                            });
                        }
                    })
                } catch (e) {
                    if (e.message == "process.getuid is not a function") {
                        console.log("add: crontab not working")
                    } else {
                        console.log(e)
                    }
                    res.end("add: crontab not working")
                }
            } else if (req.url == "/delete_row_from_cron.html") {
                console.log("del: ")
                console.log(paramstring)
                try {
                    require('crontab').load(function (err, crontab) {
                        crontab.remove({comment: paramstring.uuid})
                        crontab.save(function (err, crontab) {
                            console.log(err)
                            res.end(err)
                        });
                    })
                } catch (e) {
                    if (e.message == "process.getuid is not a function") {
                        console.log("del: crontab not working")
                    } else {
                        console.log(e)
                    }
                    res.end("del: crontab not working")
                }
            } else {
                console.log("POST: unknown URL!")
                res.end()
            }
        });
    } else {
        if (req.url == "/") {
            fs.createReadStream('index.html').pipe(res)
        } else if (req.url == "/cron_table.html") {
            createCronTable(function (cronTable) {
                res.end(cronTable)
            })
        } else {
            fs.createReadStream(req.url.slice(1)).pipe(res)
        }
    }
})

server.listen(8080)
