function showModal(message) {
    document.getElementById("message").innerText = message
    var myModal = new bootstrap.Modal(document.getElementById("messageModal"));
    myModal.show();
}

function showDelModal(message, cb) {
    document.getElementById("delete-confirm").innerText = message
    var myModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    document.getElementById("del-confirmed").addEventListener("click", cb);
    myModal.show();
}

function sendToSomfy() {
    var tris = $('input[name=tris]:checked').val()
    var cmd = $('input[name=cmd]:checked').val()
    if (cmd == 'NUMERICAL')
        cmd = $("#percent").val()

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function alertContents() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200 && httpRequest.responseText == "OK") {
                showModal("בוצע")
            } else {
                showModal("היתה תקלה");
            }
        }
    }

    httpRequest.open('POST', 'index.html');
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send("room=" + tris + "&cmd=" + cmd);
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
    console.log($("#newCronDay").val())
    console.log($("#newCronTime").val())
    console.log($("#newCronRoom").val())
    console.log($("#newCronPercent").val())
    console.log($("#newCronComment").val())
    if ($("#newCronDay").val() == '' | $("#newCronTime").val() == '' | $("#newCronRoom").val() == '' | $("#newCronPercent").val() == '')
        showModal('חסר מידע: יום/שעה/תריס/פקודה')
    else {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function alertContents() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200)
                    showModal(httpRequest.responseText)
                // if (httpRequest.status === 200 && httpRequest.responseText == "OK") {
                //     showModal("בוצע")
                // } else {
                //     showModal("היתה תקלה");
                // }
            }
        }

        httpRequest.open('POST', 'add_row_to_cron.html');
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(
            "day=" + $("#newCronDay").val() +
            "&time=" + $("#newCronTime").val() +
            "&room=" + $("#newCronRoom").val() +
            "&percent=" + $("#newCronPercent").val() +
            "&comment=" + $("#newCronComment").val());
    }
}

function deleteRow(row) {
    showDelModal("למחוק את שורה " + row + "?", function () {
        console.log("deleting " + row)
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

