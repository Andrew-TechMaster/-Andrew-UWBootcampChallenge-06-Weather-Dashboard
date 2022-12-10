/* {============================= DOM / Element / Variable Declaration  =============================} */
// let requestUrl = 'https://api.github.com/orgs/nodejs/repos';
let weatherApiKey = "91017c2e5ac723c2be5c5162fa92b851";
let testApi = `https://api.openweathermap.org/data/2.5/weather?q=tokyo&appid=${weatherApiKey}`;
// let weatherCurrentApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCityName}&appid=${weatherApiKey}`;
// let weatherFutureApi = `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCityName}&appid=${weatherApiKey}`;

let userCityInput = $("#userCityInput");
let searchBtnEl = $("#searchBtn");
let clearAllBtnEl = $("#clearBtn");
var resultCityArray = [];

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
    let todayWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${userInputCity}&appid=${weatherApiKey}&units=metric`;
    // let todayDate = dayjs().format('MM/DD/YYYY (dddd)')
    $("#todayWeather").text("");

    fetch(todayWeatherApi)
        .then((response) => { return response.json(); })
        .then(function (data) {
            // console.log("inside get today func");
            // console.log(data);

            let todayDate = transferTimestamp(data.dt);
            let todayWeatherIcon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            let todayTemp = data.main.temp;
            let todayWind = data.wind.speed;
            let todayHumidity = data.main.humidity;

            // $("#selectedCity").html(`${userInputCity}  ${todayDate}  <img src="${todayWeatherIcon}">`);
            // $("#todayTemp").text(todayTemp);
            // $("#todayWind").text(todayWind);
            // $("#todayHumidity").text(todayHumidity);

            let appendedTodayWeather = `
            <div class="card-header">
                <h3 id="selectedCity">${userInputCity}  (${todayDate})  <img src="${todayWeatherIcon}"</h3>
            </div>
            <div class="card-body">
                <p class="card-text">Temp: ${todayTemp} C</p>
                <p class="card-text">Wind: ${todayWind} MPH</p>
                <p class="card-text">Humidity: ${todayHumidity} %</p>
            </div>`;

            $("#todayWeather").append(appendedTodayWeather);
        });
}

function getFutureWeather(userInputCIty) {
    let weatherFutureApi = `https://api.openweathermap.org/data/2.5/forecast?q=${userInputCIty}&appid=${weatherApiKey}&units=metric`;
    $("#forecastWeather").text("");

    fetch(weatherFutureApi)
        .then((response) => { return response.json(); })
        .then(function (data) {
            console.log("inside get future func");
            console.log(data);
            let future5DaysData = data.list.slice(0, 5);
            // console.log(future5DaysData);
            // console.log(future5DaysData[0]);
            // console.log(typeof future5DaysData);

            future5DaysData.forEach(element => {
                let theDate = transferTimestamp(element.dt);
                let theWeatherIcon = `https://openweathermap.org/img/w/${element.weather[0].icon}.png`;
                let theTemp = element.main.temp;
                let theHumidity = element.main.humidity;
                let theWind = element.wind.speed;

                let appendedCard = `                    
                <div class="col">
                    <div class="card">
                        <div class="card-header">
                            <h4>${theDate}</h4>
                        </div>
                        <div class="card-body">
                            <p><img src="${theWeatherIcon}"</p>
                            <p class="card-text">Temp: ${theTemp} C</p>
                            <p class="card-text">Wind: ${theWind} MPH</p>
                            <p class="card-text">Humidity: ${theHumidity} %</p>
                        </div>
                    </div>
                </div>`;

                $("#forecastWeather").append(appendedCard);
            });

            $("#forecastWeather").prepend("<p>5-Day Forecast</p>");
        });
}

function getUserInput() {
    return userCityInput.val();
}

function createCityListItem(listItemName) {
    // let listItemName = getUserInput();
    let appendedListItem = `<a href="#" class="list-group-item list-group-item-action list-group-item-primary mb-3 data-cityName=${listItemName}">${listItemName}</a>`
    $(".list-group").append(appendedListItem);

    resultCityArray.push(listItemName);
    pushDataToLocalStorage(resultCityArray);
}

function pushDataToLocalStorage(cityArray) {
    var userInputCityName_Serialization = JSON.stringify(cityArray);
    localStorage.setItem("userInputCityName", userInputCityName_Serialization);
}

function init() {
    var resultCityArray = []; // why need this one again? Already empty at the start?
    var userInputCityName_DeSerialization = JSON.parse(localStorage.getItem("userInputCityName"));
    var exisitingData = userInputCityName_DeSerialization;
    if (exisitingData !== null) {
        resultCityArray = exisitingData;
        // console.log(resultCityArray);
        // console.log(resultCityArray[0]);
        resultCityArray.forEach(element => {
            createCityListItem(element);
        })
    }
}

/* {============================= Add Event Listener  =============================} */
searchBtnEl.on("click", function (evt) {
    evt.preventDefault();

    var userInput = getUserInput();
    var capitalizeduserInput = userInput[0].toUpperCase() + userInput.substring(1).toLowerCase();

    var searchedCityName = (resultCityArray.includes(capitalizeduserInput)) ? alert("This app has already contained your input city") : userInput;
    var capitalizedCityName = searchedCityName[0].toUpperCase() + searchedCityName.substring(1).toLowerCase();

    $("#titleCity").text(`City: ${capitalizedCityName}`);
    getTodayWeather(capitalizedCityName);
    getFutureWeather(capitalizedCityName);

    createCityListItem(capitalizedCityName);

    userCityInput.val("");
    console.log("------Inside Event Listener------");
    // console.log(getTestingApi(testApi));
    console.log(resultCityArray);
    console.log(userInput);
    console.log("------End Event Listener------");
});

clearAllBtnEl.on("click", function (evt) {
    evt.preventDefault();

    localStorage.clear();
    resultCityArray = [];
    $(".list-group").text("");
});

$(".list-group").on("click", ".list-group-item", function (evt) {
    evt.preventDefault();

    var selectedCityName = $(this).text();
    getTodayWeather(selectedCityName);
    getFutureWeather(selectedCityName);
})
/* {============================= Calling functions  =============================} */
init();