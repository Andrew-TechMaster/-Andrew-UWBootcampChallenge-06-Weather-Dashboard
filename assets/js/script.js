/* {============================= DOM / Element / Variable Declaration  =============================} */
// let requestUrl = 'https://api.github.com/orgs/nodejs/repos';
let weatherApiKey = "91017c2e5ac723c2be5c5162fa92b851";
let testApi = `https://api.openweathermap.org/data/2.5/weather?q=tokyo&appid=${weatherApiKey}`;
// let weatherCurrentApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCityName}&appid=${weatherApiKey}`;
// let weatherFutureApi = `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCityName}&appid=${weatherApiKey}`;

let userCityInput = $("#userCityInput");
let searchBtnEl = $("#searchBtn");

/* {============================= Functions (callback) =============================} */
function getTestingApi(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            console.log("Get Json Response:");
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log("Get Data:");
            console.log(data);
            console.log(data.main);
        });
}

function transferTimestamp(unix_timestamp) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
    // Month part from the timestamp
    var todayMonth = date.getMonth();
    // Day part from the timestamp
    var todayDay = date.getDate();
    // Year part from the timestamp
    var todayYear = date.getFullYear();

    // Will display time in 10:30:23 format
    var formattedTime = `${todayMonth}/${todayDay}/${todayYear}`;
    return formattedTime;
}

function getTodayWeather(userInputCity) {
    let todayWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${userInputCity}&appid=${weatherApiKey}`;
    // let todayDate = dayjs().format('MM/DD/YYYY (dddd)')

    fetch(todayWeatherApi)
        .then((response) => { return response.json(); })
        .then(function (data) {
            // console.log("inside get today func");
            // console.log(data);

            let todayDate = transferTimestamp(data.dt);
            let todayWeatherIcon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            let todayTemp = data.main.temp;
            let todayHumidity = data.main.humidity;
            let todayWind = data.wind.speed;

            $("#selectedCity").html(`${userInputCity}  ${todayDate}  <img src="${todayWeatherIcon}">`);
            $("#todayTemp").text(todayTemp);
            $("todayHumidity").text(todayHumidity);
            $("todayWind").text(todayWind);
        });
}

function getFutureWeather(userInputCIty) {
    let weatherFutureApi = `https://api.openweathermap.org/data/2.5/forecast?q=${userInputCIty}&appid=${weatherApiKey}`;

    fetch(weatherFutureApi)
        .then((response) => { return response.json(); })
        .then(function (data) {
            console.log("inside get future func");
            console.log(data);

            // let todayDate = transferTimestamp(data.dt);
            // let todayWeatherIcon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            // let todayTemp = data.main.temp;
            // let todayHumidity = data.main.humidity;
            // let todayWind = data.wind.speed;

            // $("#selectedCity").html(`${userInputCity}  ${todayDate}  <img src="${todayWeatherIcon}">`);
            // $("#todayTemp").text(todayTemp);
            // $("todayHumidity").text(todayHumidity);
            // $("todayWind").text(todayWind);
        });
}

function getUserInput() {
    return userCityInput.val();
}

/* {============================= Add Event Listener  =============================} */
searchBtnEl.on("click", function (evt) {
    evt.preventDefault();

    var searchedCityName = getUserInput();
    var capitalizedCityName = searchedCityName[0].toUpperCase() + searchedCityName.substring(1).toLowerCase();
    getTodayWeather(capitalizedCityName);
    getFutureWeather(capitalizedCityName);

    console.log("------Inside Event Listener------");
    // console.log(getTestingApi(testApi));
    console.log("------End Event Listener------");
});

/* {============================= Calling functions  =============================} */