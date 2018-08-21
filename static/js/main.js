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
                populateTable(JSON.parse(xhr.response).northbound, document.getElementById('northbound-table-body'))
                populateTable(JSON.parse(xhr.response).southbound, document.getElementById('southbound-table-body'))
            }
        }

        xhr.send();
    }
}

function validateSearchTerm(searchTerm) {
    var stationList = Array.from(document.getElementById('stations').options).map(x => x.value.toUpperCase());
    return stationList.includes(searchTerm);
}

function populateTable(data, table_body) {
    table_body.innerHTML = '';
    data.forEach(trainDataObj => {
        var row = table_body.insertRow()
        for (x in trainDataObj) {
            var cell = row.insertCell()
            cell.innerHTML = trainDataObj[x]
        }
    })
}