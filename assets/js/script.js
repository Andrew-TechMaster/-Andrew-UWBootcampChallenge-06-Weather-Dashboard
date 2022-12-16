/* {============================= DOM / Element / Variable Declaration  =============================} */
let weatherApiKey = "91017c2e5ac723c2be5c5162fa92b851";
let userCityInputEl = $("#userCityInput");
let searchBtnEl = $("#searchBtn");
let clearAllBtnEl = $("#clearBtn");
let cityListEl = $(".list-group");
let resultCityArray = [];

/* {============================= Functions (callback) =============================} */
// <-- [--------- For transfer timestamp to formatted time ---------] -->
function transferTimestamp(unix_timestamp) {
    let date = new Date(unix_timestamp * 1000);
    let todayMonth = date.getMonth() + 1;
    let todayDay = date.getDate();
    let todayYear = date.getFullYear();

    let formattedTime = `${todayMonth}/${todayDay}/${todayYear}`;
    return formattedTime;
};

// <-- [--------- Call Api (Today) & Display to the browser (1 card) ---------] -->
function getTodayWeather(userInputCity) {
    let todayWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${userInputCity}&appid=${weatherApiKey}&units=metric`;
    $("#todayWeather").text("");

    fetch(todayWeatherApi)
        .then((response) => { return response.json(); })
        .then(function (data) {
            let todayDate = transferTimestamp(data.dt);
            let todayWeatherIcon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            let todayTemp = data.main.temp;
            let todayWind = data.wind.speed;
            let todayHumidity = data.main.humidity;
            let countryFlag = `https://countryflagsapi.com/png/${data.sys.country}`

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
};

// <-- [--------- Call Api (futrue 5 days) & Display to the browser (5 cards) ---------] -->
function getFutureWeather(userInputCIty) {
    let weatherFutureHourlyApi = `https://api.openweathermap.org/data/2.5/forecast?q=${userInputCIty}&appid=${weatherApiKey}&units=metric`;
    $("#forecastWeather").text("");

    fetch(weatherFutureHourlyApi)
        .then((response) => { return response.json(); })
        .then(function (data) {
            // return 40 results, extract 5 of the 40 for each day
            let future5DaysData = [];
            for (let index = 7; index < data.list.length; index += 8) {
                const element = data.list[index];
                future5DaysData.push(element);
            }

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
        });
};

// <-- [--------- Simply return user input val ---------] -->
function getUserInput() {
    return userCityInputEl.val();
};

// <-- [--------- Create list of city name under search bar ---------] -->
function createCityListItem(listItemName) {
    let appendedListItem = `<a href="#" class="list-group-item list-group-item-action list-group-item-primary mb-3">
                                ${listItemName}
                                <button type="button" class="btn btn-danger" id="deleteBtn"><i class="far fa-trash-alt"></i></button>
                            </a>`

    cityListEl.append(appendedListItem);
};

// <-- [--------- Call to add data into local array ---------] -->
function addData(aCityName) {
    resultCityArray.push(aCityName);
};

// <-- [--------- Call to push data to the remote (local storage) ---------] -->
function pushDataToLocalStorage(anArray) {
    let userInputCityName_Serialization = JSON.stringify(anArray);
    localStorage.setItem("userInputCityName", userInputCityName_Serialization);
};

// <-- [--------- Call to pull data from remote (local storage) & Tranfer data to javascript object ---------] -->
function pullDataFromLocalStorage() {
    let localStorageJsonData = localStorage.getItem("userInputCityName");
    let CityName_DeSerialization = JSON.parse(localStorageJsonData);
    return CityName_DeSerialization;
};

// <-- [--------- Simpy pass user input then display in the header ---------] -->
function diplayCityNameInHeader(someString) {
    let headerCityEl = $("#titleCity");
    headerCityEl.text(`City: ${someString}`);
};

// <-- [--------- As it mentioned, diplay the content when user delete(single item or all) the record ---------] -->
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
};

// <-- [--------- init() ---------] -->
function init() {
    let pulledData = pullDataFromLocalStorage();
    if (pulledData !== null) {
        resultCityArray = pulledData;
        resultCityArray.forEach(element => {
            createCityListItem(element);
        })
    }
};

/* {============================= Add Event Listener  =============================} */
// <-- [--------- When user click "search" with valid city name => Call multiple functions ---------] -->
searchBtnEl.on("click", function (evt) {
    evt.preventDefault();

    let userInput = getUserInput();
    let capitalizeduserInput = userInput[0].toUpperCase() + userInput.substring(1).toLowerCase();

    // make the list unique
    let searchedCityName = (resultCityArray.includes(capitalizeduserInput)) ? alert("This app has already contained your input city") : userInput;
    let capitalizedCityName = searchedCityName[0].toUpperCase() + searchedCityName.substring(1).toLowerCase();


    diplayCityNameInHeader(capitalizedCityName);
    getTodayWeather(capitalizedCityName);
    getFutureWeather(capitalizedCityName);
    createCityListItem(capitalizedCityName);
    addData(capitalizedCityName);
    pushDataToLocalStorage(resultCityArray);

    userCityInputEl.val("");
});

// <-- [--------- When user click "clear all" button => Call multiple functions ---------] -->
clearAllBtnEl.on("click", function (evt) {
    evt.preventDefault();

    localStorage.clear();
    resultCityArray = [];
    cityListEl.text("");
    whenUserDelteThenRenderThisContent();
    diplayCityNameInHeader("Not Found");
});

// <-- [--------- When user click "list-item" => Render data in the page ---------] -->
cityListEl.on("click", ".list-group-item", function (evt) {
    evt.preventDefault();

    let selectedCityName = $(this).text();
    diplayCityNameInHeader(selectedCityName);
    getTodayWeather(selectedCityName);
    getFutureWeather(selectedCityName);
});

// <-- [--------- When user click "trash can icon" => ---------] -->
cityListEl.on("click", "#deleteBtn", function (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // need to trim() or it will return a bunch of space...
    var deletedCityName = $(this).parent().text().trim();
    let pulledData = pullDataFromLocalStorage();
    // filter the deleted city out in the local array 
    resultCityArray = pulledData.filter((item) => item !== deletedCityName);

    // push to remote (local storage) again / replace to new one(same key name so it will automatically cover)
    pushDataToLocalStorage(resultCityArray);

    // first clear all the context and then re-render a new list result
    cityListEl.text("");
    resultCityArray.forEach(element => {
        createCityListItem(element);
    });

    whenUserDelteThenRenderThisContent();
    diplayCityNameInHeader("Not Found");
});

/* {============================= Calling functions  =============================} */
init();
