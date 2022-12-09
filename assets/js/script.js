/* {============================= DOM / Element / Variable Declaration  =============================} */
let requestUrl = 'https://api.github.com/orgs/nodejs/repos';
let weatherApiKey = "91017c2e5ac723c2be5c5162fa92b851";
// let weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCityName}&appid=${weatherApiKey}`;

let userCityInput = $("#userCityInput");

let searchBtnEl = $("#searchBtn");

/* {============================= Functions (callback) =============================} */
function getApi(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

function getUserInput() {
    return userCityInput.val();
}

/* {============================= Add Event Listener  =============================} */
searchBtnEl.on("click", function () {
    var searchedCityName = getUserInput();
    let weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCityName}&appid=${weatherApiKey}`;
    getApi(weatherApi);

    console.log(searchedCityName);
    console.log(weatherApi);
});

/* {============================= Calling functions  =============================} */