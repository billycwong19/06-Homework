var searchCard = document.querySelector('.searchCard')
var submitBtn = document.querySelector('.submitBtn')
var dateAndTime = document.querySelector('.dateAndTime')
var currentContainer = document.querySelector('.currentContainer')
var citySearchText = document.querySelector('.citySearchText')
var key = "a976a17f2929049a5c3d9fd40c354e20"

var updateTime = function() {
    dateAndTime.textContent = moment().format('MMMM Do YYYY, h:mm:ss a');
    }
setInterval(updateTime, 1000);

function citySearch(){
    var cityName;
    var current = document.querySelector('.current');
    var responseText = document.querySelector('.responseText')
    if (responseText) {
    responseText.remove();
    }
    if (current) {
        current.remove();
        if (citySearchText.value[0] >= 0){
            var zipCode = citySearchText.value
                return zipCodeSearch(zipCode)
        } else {
            cityName = citySearchText.value;
            return cityNameSearch(cityName);
        }
    } else {
        cityName = "austin";
        }
        cityNameSearch(cityName)
    }

function cityNameSearch(cityName){    
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&units=imperial&appid=" + key)
    .then(function (response) {
        return response.json();
    })
        .then(function (data) {
            console.log(data)
            var cityLat = data[0].lat;
            var cityLon = data[0].lon;
            var cityName = data[0].name;
            var stateName = data[0].state;
            console.log(cityLat, cityLon, cityName, stateName)
            weatherSearch(cityLat, cityLon, cityName, stateName)
    })
}

function zipCodeSearch(zipCode){
    fetch("http://api.openweathermap.org/geo/1.0/zip?zip=" + zipCode + "&units=imperial&appid=" + key)
    .then(function (response) {
        if (response.status !== 200) {
            var responseText = document.createElement('h1')
            responseText.setAttribute('class', 'responseText')
            responseText.textContent = response.status + " dude! Try again!";
            currentContainer.append(responseText)
        }
        return response.json();
    })
        .then(function (data) {
            console.log(data)
            var cityName = data.name
            cityNameSearch(cityName)
    })
}

function weatherSearch(cityLat, cityLon, cityName, stateName) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "& units=imperial&appid=" + key)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        var current = document.createElement('div')
        current.setAttribute('class', 'current row p-3 m-1')
        currentContainer.append(current)

        var cityCard = document.createElement('div')
        cityCard.setAttribute('class','col-4')
        current.append(cityCard)

        var city = document.createElement('h2');
        city.textContent = cityName + ", " + stateName;
        cityCard.append(city)

        var weatherDescrition = document.createElement('p');
        var grabDescription = data.current.weather[0].description;
        weatherDescrition.textContent = grabDescription;
        cityCard.append(weatherDescrition)

        var currentTemp = document.createElement('h1');
        var grabCurrentFar = (data.current.temp - 273.15) * 9 / 5 + 32;
        currentTemp.textContent = Math.floor(grabCurrentFar) + "°"
        cityCard.append(currentTemp)
        
        var feelsLikeTemp = document.createElement('h5');
        var grabFeelsLike = (data.current.feels_like - 273.15) * 9 / 5 + 32;
        feelsLikeTemp.textContent = "Feels like " + Math.floor(grabFeelsLike) + "°"
        cityCard.append(feelsLikeTemp)

        var weatherAdvisory = document.createElement('p');
        weatherAdvisory.setAttribute('class','text-danger')
        if (data.alerts) {
            var grabAdvisory = data.alerts[0].event;
            weatherAdvisory.textContent = grabAdvisory;
            cityCard.append(weatherAdvisory)
        }

        var weeklyForecast = document.createElement('button');
        weeklyForecast.setAttribute('type','submit')
        weeklyForecast.setAttribute('class','weeklyForecast btn btn-primary btn-md')
        weeklyForecast.textContent = "5 Day Forecast"
        cityCard.append(weeklyForecast)

        // current wind speed, uv index, and humidity
        var currentStats = document.createElement('div')
        currentStats.setAttribute('class', 'currentStats col-3 d-flex flex-wrap align-items-center justify-content-start')
        current.append(currentStats)

        var currentHumidity = document.createElement('h5');
        currentHumidity.setAttribute('class', 'text-warning w-100')
        var grabCurrentHumidity = data.current.humidity
        currentHumidity.textContent = "Humidity: " + grabCurrentHumidity;
        currentStats.append(currentHumidity)

        var currentUvi = document.createElement('h5');
        currentUvi.setAttribute('class', 'text-warning w-75')
        var grabCurrentUvi = data.current.uvi;
        var currentUviCircle = document.createElement('h6');
        currentUviCircle.setAttribute('style', 'border-radius:50%')
        currentUviCircle.setAttribute('class', 'uviCircle w-max')
        currentUviCircle.textContent = "";
        currentUvi.textContent = "UV Index: " + grabCurrentUvi;
        if (grabCurrentUvi >= 11) {
            currentUviCircle.setAttribute('class', 'uviCircle w-max violet')
        } else if (grabCurrentUvi >= 7 && grabCurrentUvi < 11) {
            currentUviCircle.setAttribute('class', 'uviCircle w-max red')
        } else if (grabCurrentUvi >= 6 && grabCurrentUvi < 7) {
            currentUviCircle.setAttribute('class', 'uviCircle w-max orange')
        } else if (grabCurrentUvi >= 3 && grabCurrentUvi < 6) {
            currentUviCircle.setAttribute('class', 'uviCircle w-max yellow')
        } else {
            currentUviCircle.setAttribute('class', 'uviCircle w-max green')
        } 
        currentStats.append(currentUvi)
        currentStats.append(currentUviCircle)

        var currentWind = document.createElement('h5');
        currentWind.setAttribute('class', 'text-warning w-100')
        var grabCurrentWind = data.current.wind_speed;
        currentWind.textContent = "Wind Speed: " + grabCurrentWind;
        currentStats.append(currentWind)

        var weatherIconDiv = document.createElement('div')
        weatherIconDiv.setAttribute('class','weatherIconDiv col-5 d-flex justify-content-center')
        current.appendChild(weatherIconDiv)

        var weatherIcon = document.createElement('img');
        weatherIcon.setAttribute('class','weatherIcon')
        var grabIcon = data.current.weather[0].icon;
        weatherIcon.src = "http://openweathermap.org/img/wn/" + grabIcon + "@2x.png"
        weatherIconDiv.append(weatherIcon)
      })
    }

function fiveDayForecast(){
    console.log(data.daily)
    var forecastDiv = document.createElement('div')
    forecastDiv.setAttribute('class', 'forecastDiv')
    currentContainer.appendChild(forecastDiv)
    for (let i = 0; i <= 5; i++){
        var dayCard = document.createElement('div')
        dayCard.setAttribute('class','dayCard col-6 col-md-2 col-lg-2')
        forecastDiv.appendChild(dayCard)
        var day = document.createElement('')

    }
}

function init(){
    updateTime();
    citySearch();
    
}

init();

submitBtn.addEventListener("click", citySearch);
document.addEventListener('keyup', function(event){
    var target = event.key;
        if (target === "Enter"){
            citySearch();
        }
})
var weeklyForecast = document.querySelector('.weeklyForecast')
weeklyForecast.addEventListener("click", fiveDayForecast)


// searchCard.addEventListener("submit", search)

// dynamically generate text input to update cities list