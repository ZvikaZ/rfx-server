const http = require('http')
const fs = require('fs')
const qs = require('querystring');

let cronTable = ""

function createCronTable() {
    function addUsersNewRow() {
        let result = "<tr>"
        result += '<td><button type="button" class="btn btn-primary btn-sm " onclick="addCronRow()"><small>הוסף</small></button></td>'
        result += '<td><select id="newCronDay" class="custom-select form-control form-control-sm">\n' +
            '  <option value="" selected>ביום...</option>\n' +
            '  <option value="*">כל יום</option>\n' +
            '  <option value="0">ראשון</option>\n' +
            '  <option value="1">שני</option>\n' +
            '  <option value="2">שלישי</option>\n' +
            '  <option value="3">רביעי</option>\n' +
            '  <option value="4">חמישי</option>\n' +
            '  <option value="5">שישי</option>\n' +
            '  <option value="6">שבת</option>\n' +
            '</select></td>'
        result += '<td><input type="time" id="newCronTime" class="form-control form-control-sm" "</td>'
        result += '<td><select id="newCronRoom" class="custom-select form-control form-control-sm">\n' +
            '  <option value="" selected>תריס...</option>\n' +
            '  <option value="SALON_OUT">סלון למרפסת</option>\n' +
            '  <option value="SALON_SMALL">סלון חלון</option>\n' +
            '  <option value="KITCHEN1">מטבח דרום</option>\n' +
            '  <option value="KITCHEN2">מטבח מזרח</option>\n' +
            '  <option value="PARENTS">הורים</option>\n' +
            '  <option value="UP_OUT">מרפסת עלינה</option>\n' +
            '  <option value="ALL">(קבוצה) הכל</option>\n' +
            '  <option value="PUBLIC">(קבוצה) סלון מטבח</option>\n' +
            '  <option value="PUBLIC_SMALL">(קבוצה) חלונות סלון מטבח</option>\n' +
            '</select></td>'
        result += '<td><input type="number" id="newCronPercent" class="form-control form-control-sm" " min=0 max=100 placeholder="אחוזים"></td>'
        result += '<td><input type="text" id="newCronComment" class="form-control form-control-sm" " placeholder="הערה"></td>'
        result += "</tr>"
        return result
    }

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
            table += addUsersNewRow();
            table += '</tbody>'
            cronTable = table
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
                    '</th>'+
                '\t\t<td>שבת</td>\n' +
                '\t\t<td>7:10</td>\n' +
                '\t\t<td>הורים</td>\n' +
                '\t\t<td>83</td>\n' +
                '\t\t<td></td>\n' +
                '\t</tr>\n' +
                '\t<tr>\n' +
                    '\t\t<th scope="row">' +
                        '<div class="row-container">\n' +
                            '<div class="text row-text" id="textRow2">2</div>\n' +
                            '<button type="button" class="btn btn-danger btn-sm row-del-button" id="delButton2" onclick="deleteRow(2)">מחק</button>' +
                        '</div>\n' +
                    '</th>'+
                '\t\t<td>שבת</td>\n' +
                '\t\t<td>7:15</td>\n' +
                '\t\t<td>הורים</td>\n' +
                '\t\t<td>למטה</td>\n' +
                '\t\t<td></td>\n' +
                '\t</tr>\n' +
                '\t<tr>\n' +
                '\t\t<th scope="row">3</th>\n' +
                '\t\t<td>כל יום</td>\n' +
                '\t\t<td>9:20</td>\n' +
                '\t\t<td>מטבח דרום</td>\n' +
                '\t\t<td>35</td>\n' +
                '\t\t<td></td>\n' +
                '\t</tr>\n' +
                '</tbody>'
                "</tbody>"
            table += addUsersNewRow();
            table += '</tbody>'
            cronTable = table
        } else
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
            console.log(req.url)
            var paramstring = qs.parse(postdata)

            if (req.url == "/index.html") {
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
            } else if (req.url == "/add_row_to_cron.html") {
                console.log(paramstring)
                //TODO: cron this
                //TODO: report back success or failure
                res.end("זה עדין לא עובד")
                //TODO support deletion
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
