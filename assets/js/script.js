const API_KEY = "0c8MTQnl8lWpzEHaBQt6nn-60AM";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", (e) => postForm(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);
    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayAPIError(data);
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let heading = "API Key Status";
    let results = "<div>API's expiry date:</div>";
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}

async function postForm(e) {
    // document.getElementById("url")["value"] = "https://mattrudge.net/assets/js/menu.js";
    const form = processFormOptions(new FormData(document.getElementById("checksform")));

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                        },
                        body: form
    })
    const data = await response.json();

    if (response.ok) {
        displayCodeError(data);
    } else {
        displayAPIError(data);
        throw new Error(data.error);
    }
}

function processFormOptions(form) {
    let optionsArr = [];
    for (entry of form.entries()) {
        if (entry[0] === 'options') {
            optionsArr.push(entry[1]);
        }
    }
    form.delete('options');
    form.append('options', optionsArr.join());

    return form;
}

function displayCodeError(data) {
    let heading = `JSHint Error Check for file ${data.file}`;
    let result = "";

    if (data.total_errors === 0) {
        result = "No Errors Found!";
    } else {
        result = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let err of data.error_list) {
            result += `At line <span class="error_line">${err.line}</span>, `;
            result += `column <span class="error_col">${err.col}</span></div>`;
            result += `<div class="error">${err.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = result;
    resultsModal.show();
}

function displayAPIError(data) {
    let heading = "An Exception Occurred";
    let result = `<div>The API returned status code: ${data.status_code}</div>`;
    result += `<div>Error Number: <strong>${data.error_no}</strong></div>`;
    result += `<div>Error Text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.querySelector("#results-content").innerHTML = result;

    resultsModal.show();
}