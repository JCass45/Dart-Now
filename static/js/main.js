function getStationData(event) {
    event.preventDefault(); // Stops submit button redirecting
    var searchText = document.getElementById('station-select').value.toUpperCase();
    var errorText = document.getElementById('error-message');

    var errorText = document.getElementById('no-station-error')
    if (!validateSearchTerm(searchText)) {
        errorText.innerHTML = 'That station does not exist';
    } else {
        if (errorText.innerHTML != '') errorText.innerHTML = '';

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/times?station=' + searchText, true);
        xhr.onload = function () {
            if (xhr.status == 200) {
                populateTable(JSON.parse(xhr.response))
            }
        }

        xhr.send();
    }
}

function validateSearchTerm(searchTerm) {
    var stationList = Array.from(document.getElementById('stations').options).map(x => x.value.toUpperCase());
    return stationList.includes(searchTerm);
}

function populateTable(data) {
    var table = document.getElementById('northbound-table')
    clearTable(table)
    data.northbound.forEach(trainDataObj => {
        var row = table.insertRow()
        for (x in trainDataObj) {
            var cell = row.insertCell()
            cell.innerHTML = trainDataObj[x]
        }
    })

    table = document.getElementById('southbound-table')
    clearTable(table)
    data.southbound.forEach(trainDataObj => {
        var row = table.insertRow()
        for (x in trainDataObj) {
            var cell = row.insertCell()
            cell.innerHTML = trainDataObj[x]
        }
    })
}

function clearTable(table) {
    var numRows = table.childElementCount

    // Leave the first row which has the Destination, Due In, Late By headings
    for (var i = 1; i < numRows; i++) {
        table.removeChild(table.children[i])
    }
}