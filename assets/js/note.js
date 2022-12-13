/* {============================= DOM / Element / Variable Declaration  =============================} */
// let requestUrl = 'https://api.github.com/orgs/nodejs/repos';
let weatherApiKey = "91017c2e5ac723c2be5c5162fa92b851";
let testApi = `https://api.openweathermap.org/data/2.5/weather?q=tokyo&appid=${weatherApiKey}`;
// let weatherCurrentApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCityName}&appid=${weatherApiKey}`;
// let weatherFutureApi = `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCityName}&appid=${weatherApiKey}`;

let userCityInputEl = $("#userCityInput");
let searchBtnEl = $("#searchBtn");
let clearAllBtnEl = $("#clearBtn");
let cityListEl = $(".list-group");

let resultCityArray = [];

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
    let date = new Date(unix_timestamp * 1000);
    // Month part from the timestamp
    let todayMonth = date.getMonth() + 1;
    // Day part from the timestamp
    let todayDay = date.getDate();
    // Year part from the timestamp
    let todayYear = date.getFullYear();

    // Will display time in format
    let formattedTime = `${todayMonth}/${todayDay}/${todayYear}`;
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
            let countryFlag = `https://countryflagsapi.com/png/${data.sys.country}`

            // $("#selectedCity").html(`${userInputCity}  ${todayDate}  <img src="${todayWeatherIcon}">`);
            // $("#todayTemp").text(todayTemp);
            // $("#todayWind").text(todayWind);
            // $("#todayHumidity").text(todayHumidity);

            let appendedTodayWeather = `
            <div class="card-header">
                <h3 id="selectedCity">${userInputCity}  (${todayDate})  <img src="${todayWeatherIcon}"></h3>
            </div>
            <div class="card-body">
                <p class="card-text"> <i class="fas fa-thermometer-three-quarters"></i> Temp: ${todayTemp} °C</p>
                <p class="card-text"> <i class="fas fa-wind"></i> Wind: ${todayWind} MPH</p>
                <p class="card-text"> <i class="fas fa-umbrella"></i> Humidity: ${todayHumidity} %</p>
            </div>`;

            let appendedBackGround = `<img src="${countryFlag}" style="width:10%; margin-right: 30px">`;

            $("#todayWeather").append(appendedTodayWeather);
            $("#titleCity").prepend(appendedBackGround);
        });
}

function getFutureWeather(userInputCIty) {
    let weatherFutureHourlyApi = `https://api.openweathermap.org/data/2.5/forecast?q=${userInputCIty}&appid=${weatherApiKey}&units=metric`;
    // let wetherFutureDailyApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`
    $("#forecastWeather").text("");

    fetch(weatherFutureHourlyApi)
        .then((response) => { return response.json(); })
        .then(function (data) {
            // console.log("inside get future func");
            console.log(data);
            // console.log(data.city.coord)
            // console.log(data.city.coord.lat)
            // console.log(data.city.coord.lon)

            // let future3HoursData = data.list.slice(0, 5);
            let future5DaysData = [];
            for (let index = 0; index < data.list.length; index += 8) {
                const element = data.list[index];
                future5DaysData.push(element);
            }

            // console.log(future5HoursData);
            // console.log(future5HoursData[0]);
            // console.log(typeof future5HoursData);

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
                            <p class="card-text"><i class="fas fa-thermometer-three-quarters"></i> Temp: ${theTemp} °C</p>
                            <p class="card-text"><i class="fas fa-wind"></i> Wind: ${theWind} MPH</p>
                            <p class="card-text"><i class="fas fa-umbrella"></i> Humidity: ${theHumidity} %</p>
                        </div>
                    </div>
                </div>`;

                $("#forecastWeather").append(appendedCard);
            });

            prependContent = `<h3><i class="fas fa-flag"></i> 5-Day Forecast: </h3>`
            $("#forecastWeather").prepend(prependContent);

            // let cityLat = data.city.coord.lat;
            // let cityLon = data.city.coord.lon;
            // let future5DailyApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${weatherApiKey}&units=metric`;
            // console.log(future5DailyApi);
            // return fetch(future5DailyApi);
        });
    // .then((response) => { return response.json() })
    // .then(function (data) {
    //     console.log(data);
    // })


}

function getUserInput() {
    return userCityInputEl.val();
}

function createCityListItem(listItemName) {
    // let listItemName = getUserInput();
    let appendedListItem = `<a href="#" class="list-group-item list-group-item-action list-group-item-primary mb-3">
                                ${listItemName}
                                <button type="button" class="btn btn-danger" id="deleteBtn"><i class="far fa-trash-alt"></i></button>
                            </a>`

    cityListEl.append(appendedListItem);
    // resultCityArray.push(listItemName);
    // pushDataToLocalStorage(resultCityArray);
}

// function pushDataToLocalStorage(cityArray) {
//     var userInputCityName_Serialization = JSON.stringify(cityArray);
//     localStorage.setItem("userInputCityName", userInputCityName_Serialization);
// }

function addData(aCityName) {
    resultCityArray.push(aCityName);
}

function pushDataToLocalStorage(anArray) {
    let userInputCityName_Serialization = JSON.stringify(anArray);
    localStorage.setItem("userInputCityName", userInputCityName_Serialization);
}

function pullDataFromLocalStorage() {
    let localStorageJsonData = localStorage.getItem("userInputCityName");
    let CityName_DeSerialization = JSON.parse(localStorageJsonData);
    return CityName_DeSerialization;
}

function diplayCityNameInHeader(someString) {
    let headerCityEl = $("#titleCity");
    headerCityEl.text(`City: ${someString}`);
}

function whenUserDelteThenRenderThisContent() {
    $("#majorSection").text("");

    let displayedContent = `<div class="card mb-5" id="todayWeather">
                                <img class="card-img" src="./assets/images/weatherIcon.jpg" alt="Card image">
                                    <div class="card-img-overlay">
                                        <h4>Enter a valid city name then click search button to get the weather.</h4>
                                        <h4>Click the saved city in the sidebar to render data.</h4>
                                        <h4>Click trashcan icon to delete single rocord.</h4>
                                        <h4>Clear All button will delete all saved cities.</h4>
                                    </div>
                            </div>
                            <div class="row" id="forecastWeather"></div>`
    $("#majorSection").append(displayedContent);
}

function init() {
    // var resultCityArray = []; // why need this one again? Already empty at the start?
    // var userInputCityName_DeSerialization = JSON.parse(localStorage.getItem("userInputCityName"));
    // var exisitingData = userInputCityName_DeSerialization;
    let pulledData = pullDataFromLocalStorage();
    if (pulledData !== null) {
        resultCityArray = pulledData;
        // pushDataToLocalStorage(resultCityArray);
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

    let userInput = getUserInput();
    let capitalizeduserInput = userInput[0].toUpperCase() + userInput.substring(1).toLowerCase();

    let searchedCityName = (resultCityArray.includes(capitalizeduserInput)) ? alert("This app has already contained your input city") : userInput;
    let capitalizedCityName = searchedCityName[0].toUpperCase() + searchedCityName.substring(1).toLowerCase();

    // $("#titleCity").text(`City: ${capitalizedCityName}`);
    diplayCityNameInHeader(capitalizedCityName);
    getTodayWeather(capitalizedCityName);
    getFutureWeather(capitalizedCityName);

    createCityListItem(capitalizedCityName);
    addData(capitalizedCityName);
    pushDataToLocalStorage(resultCityArray);

    userCityInputEl.val("");

    console.log("<------Inside Event Listener Create------>");
    // console.log(getTestingApi(testApi));
    console.log(resultCityArray);
    // console.log(userInput);
    console.log("<------End Event Listener Create------>");
});

clearAllBtnEl.on("click", function (evt) {
    evt.preventDefault();

    localStorage.clear();
    resultCityArray = [];
    cityListEl.text("");
    whenUserDelteThenRenderThisContent();
    diplayCityNameInHeader("Not Found");
});

cityListEl.on("click", ".list-group-item", function (evt) {
    evt.preventDefault();

    let selectedCityName = $(this).text();
    diplayCityNameInHeader(selectedCityName);
    getTodayWeather(selectedCityName);
    getFutureWeather(selectedCityName);

    console.log("<------Inside Event Listener Click List Item------>");
    console.log(resultCityArray);
    console.log(`${selectedCityName} is selected`);
    console.log("<------End Event Listener Click List Item------>");
});

cityListEl.on("click", "#deleteBtn", function (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // console.log($(this).parent().text().trim());
    // console.log(typeof $(this).parent().text());
    // console.log($(this).siblings());
    var deletedCityName = $(this).parent().text().trim();

    // var userInputCityName_DeSerialization = JSON.parse(localStorage.getItem("userInputCityName"));
    // resultCityArray = userInputCityName_DeSerialization;
    let pulledData = pullDataFromLocalStorage();
    resultCityArray = pulledData.filter((item) => item !== deletedCityName);

    // localStorage.clear();
    pushDataToLocalStorage(resultCityArray);

    // $(".list-group").text("");
    // resultCityArray.forEach(element => {
    //     let appendedListItem = `<a href="#" class="list-group-item list-group-item-action list-group-item-primary mb-3">
    //                                 ${element}
    //                                 <button type="button" class="btn btn-danger" id="deleteBtn"><i class="far fa-trash-alt"></i></button>
    //                             </a>`;

    //     $(".list-group").append(appendedListItem);
    // })

    cityListEl.text("");
    resultCityArray.forEach(element => {
        createCityListItem(element);
    });

    whenUserDelteThenRenderThisContent();
    diplayCityNameInHeader("Not Found");
    console.log("<------Inside Event Listener Delete------>");
    console.log(resultCityArray);
    console.log(`${deletedCityName} is deleted`);
    console.log("<------End Event Listener Delete------>");
})

/* {============================= Calling functions  =============================} */
init();

console.log("<======refresh start======>");
console.log(resultCityArray);
console.log("<======refresh end======>");