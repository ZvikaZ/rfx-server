function showModal(message) {
    document.getElementById("message").innerText = message
    var myModal = new bootstrap.Modal(document.getElementById("messageModal"));
    myModal.show();
}

function showDelModal(message, cb) {
    document.getElementById("delete-confirm").innerText = message
    var myModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    document.getElementById("del-confirmed").onclick = cb
    myModal.show();
}

function ajaxPost(url, message, successCb) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function alertContents() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                successCb(httpRequest.responseText)
            } else {
                showModal("היתה תקלה");
            }
        }
    }

    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(message);
}

function sendToSomfy() {
    var tris = $('input[name=tris]:checked').val()
    var cmd = $('input[name=cmd]:checked').val()
    if (cmd == 'NUMERICAL')
        cmd = $("#percent").val()
    ajaxPost('index.html', "room=" + tris + "&cmd=" + cmd, function (responseText) {
        // success callback
        if (responseText == "OK") {
            showModal("בוצע")
        } else {
            showModal("היתה תקלה");
        }
    });
}

function percentChange(value) {
    document.getElementById("NUMERICAL").checked = true
    $("#cmdRange").val(value)
}

function rangeInput() {
    document.getElementById("NUMERICAL").checked = true
    percent.value = cmdRange.value
}

function initCronCmdsTable() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function alertContents() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const table = document.getElementById("cronCmdTableBody")
                table.innerHTML = httpRequest.responseText
            }
        }
    }

    httpRequest.open('GET', 'cron_table.html');
    httpRequest.send();
}

function addCronRow() {
    // console.log($("#newCronDay").val())
    // console.log($("#newCronTime").val())
    // console.log($("#newCronRoom").val())
    // console.log($("#newCronPercent").val())
    // console.log($("#newCronComment").val())
    if ($("#newCronDay").val() == '' | $("#newCronTime").val() == '' | $("#newCronRoom").val() == '' | $("#newCronPercent").val() == '')
        showModal('חסר מידע: יום/שעה/תריס/פקודה')
    else {
        ajaxPost('add_row_to_cron.html',
            "day=" + $("#newCronDay").val() +
            "&time=" + $("#newCronTime").val() +
            "&room=" + $("#newCronRoom").val() +
            "&percent=" + $("#newCronPercent").val() +
            "&comment=" + $("#newCronComment").val(),
            function (responseText) {
				console.log(responseText)
				if (responseText != '')
					showModal("היתקה תקלה")
				initCronCmdsTable();
            })
    }
}

function deleteRow(row) {
    showDelModal("למחוק את שורה " + row + "?", function () {
        ajaxPost('delete_row_from_cron.html', "row=" + row, function (responseText) {
        })
    })
}

function setDefaults() {
    $("#SALON_OUT").attr("checked", true)
    $("#MY").attr("checked", true)
    $("#cmdRange").val(90)
    $("#percent").val(90)
    // $("#cmdRange").attr("disabled", true)

    initCronCmdsTable();
}

window.onload = setDefaults;

