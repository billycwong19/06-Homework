var searchCard = document.querySelector('.searchCard')
var submitBtn = document.querySelector('.submitBtn')
var dateAndTime = document.querySelector('.dateAndTime')
var currentContainer = document.querySelector('.currentContainer')
var citySearchText = document.querySelector('.citySearchText')
var key = "a976a17f2929049a5c3d9fd40c354e20"
// function to update time by the second
var updateTime = function() {
    dateAndTime.textContent = moment().format('MMMM Do YYYY, h:mm:ss a');
    }
setInterval(updateTime, 1000);
// the city search sorter. reset some elements on the screen and took in either a city name or zip code and routed it to the correct function. otherwise austin is the default display
function citySearch(cityName){
    var current = document.querySelector('.current');
    var forecastDiv = document.querySelector('.forecastDiv');
    var responseText = document.querySelector('.responseText')
    if (responseText) {
        responseText.remove();
    }
    if (current && forecastDiv) {
        forecastDiv.remove();
        current.remove();
        }
    if (cityName && cityName[0] >= 0 && current && forecastDiv) {
        forecastDiv.remove();
        current.remove();
        return zipCodeSearch(cityName)
    } else if (cityName && current && forecastDiv) {
        forecastDiv.remove();
        current.remove();
        return cityNameSearch(cityName);
    } else if (cityName && !current && !forecastDiv){
        return cityNameSearch(cityName);
    } else if (!cityName && !current && !forecastDiv && citySearchText.value === ""){
        var cityName = "Austin"
        return cityNameSearch(cityName)
    } else {
        if (citySearchText.value[0] >= 0){
            var zipCode = citySearchText.value
            return zipCodeSearch(zipCode)
        } else {
            cityName = citySearchText.value;
            return cityNameSearch(cityName);
        }
    }
}
// generated list of past cities. i broke the code here and finally got it to spit out something but its really buggy
function pastCities(cities){
    var cityList = document.createElement('ul')
    cityList.setAttribute('class','sortable')
    cityList.setAttribute('id','sortable')
    searchCard.append(cityList)
    $( "#sortable" ).sortable();
    for (let i = 0; i < cities.length; i++) {
        var city = document.createElement('li')
        cityList.append(city)
        var citySpan = document.createElement('span')
        citySpan.setAttribute('id', "city-name")
        citySpan.textContent = cities[i]
        city.append(citySpan)
    }

}
// this is part of the bugs. it generates array items based on input stored in the local storage
function changePastCities(cityName){
    var cities = [];
    var lastCity = cityName
    cities.unshift(lastCity);
    console.log(cities)
    pastCities(cities);
}

// routed from the sorter it takes a zip code and returns a city name and passes that as an argument to the next function
function zipCodeSearch(zipCode){
    fetch("https://api.openweathermap.org/geo/1.0/zip?zip=" + zipCode + "&units=imperial&appid=" + key, {
        method: 'GET', 
        credentials: 'same-origin', 
        redirect: 'follow', 
        })
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
// the cityName from zipCode is taken here or a cityName was passed on from the sorter function from earlier. this last module takes in a city name and outputs longitude, latitude, name of the city, and the state. finally calls the weather search
var x = 1;
function cityNameSearch(cityName){    
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&units=imperial&appid=" + key, {
        method: 'GET', 
        credentials: 'same-origin', 
        redirect: 'follow', 
        })
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
            var current = document.querySelector('.current');
            var forecastDiv = document.querySelector('.forecastDiv')
            if (current && forecastDiv) {
                forecastDiv.remove();
                current.remove();
            }
            var cityLat = data[0].lat;
            var cityLon = data[0].lon;
            var cityName = data[0].name;
            var stateName = data[0].state;
            changePastCities(cityName)
            weatherSearch(cityLat, cityLon, cityName, stateName)
    })
}
// takes in latitude longitude to access data from the weather api. then it generates html elements based on the predefined statistics we have decided to display. i added a few more as well. 
function weatherSearch(cityLat, cityLon, cityName, stateName) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "& units=imperial&appid=" + key, {
        method: 'GET', 
        credentials: 'same-origin', 
        redirect: 'follow', 
        })
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        var current = document.createElement('div')
        current.setAttribute('class', 'current row p-3 m-1')
        currentContainer.append(current)

        var cityCard = document.createElement('div')
        cityCard.setAttribute('class','cityCard col-4')
        current.append(cityCard)
        //city name and state name used here in h2 element
        var city = document.createElement('h2');
        city.textContent = cityName + ", " + stateName;
        cityCard.append(city)
        // weather description
        var weatherDescrition = document.createElement('p');
        var grabDescription = data.current.weather[0].description;
        weatherDescrition.textContent = grabDescription;
        cityCard.append(weatherDescrition)
        // current temperature
        var currentTemp = document.createElement('h1');
        currentTemp.setAttribute('class','text-dark')
        var grabCurrentFar = (data.current.temp - 273.15) * 9 / 5 + 32;
        currentTemp.textContent = Math.floor(grabCurrentFar) + "°"
        cityCard.append(currentTemp)
        // feels like temperature
        var feelsLikeTemp = document.createElement('h5');
        feelsLikeTemp.setAttribute('class','')
        var grabFeelsLike = (data.current.feels_like - 273.15) * 9 / 5 + 32;
        feelsLikeTemp.textContent = "Feels like " + Math.floor(grabFeelsLike) + "°"
        cityCard.append(feelsLikeTemp)
        // if there is a weather advisory it will display it
        var weatherAdvisory = document.createElement('p');
        weatherAdvisory.setAttribute('class','text-danger')
        if (data.alerts) {
            var grabAdvisory = data.alerts[0].event;
            weatherAdvisory.textContent = grabAdvisory;
            cityCard.append(weatherAdvisory)
        }
        // this geneartes the element for the weekly forecast elements to live inside
        var weeklyForecast = document.createElement('input');
        weeklyForecast.setAttribute('type', 'submit')
        weeklyForecast.setAttribute('value',"5-Day Forecast")
        weeklyForecast.setAttribute('class','weeklyForecast btn btn-primary btn-md')
        weeklyForecast.setAttribute('id','weeklyForecast')
        cityCard.append(weeklyForecast)
        
        var weatherIconDiv = document.createElement('div')
        weatherIconDiv.setAttribute('class','weatherIconDiv col-4 d-flex align-items-center')
        current.append(weatherIconDiv)
        // weather icon for the current day
        var weatherIcon = document.createElement('img');
        weatherIcon.setAttribute('class','weatherIcon')
        var grabIcon = data.current.weather[0].icon;
        weatherIcon.src = "https://openweathermap.org/img/wn/" + grabIcon + "@2x.png"
        weatherIconDiv.append(weatherIcon)
        fiveDayForecast(data);

        // current humidity, uv index, and windspeed
        var currentStats = document.createElement('div')
        currentStats.setAttribute('class', 'currentStats col-2 d-flex flex-wrap align-items-center justify-content-start')
        current.append(currentStats)

        var currentHumidity = document.createElement('h5');
        currentHumidity.setAttribute('class', 'text-warning w-100')
        var grabCurrentHumidity = data.current.humidity
        currentHumidity.textContent = "Humidity: " + grabCurrentHumidity + "%";
        currentStats.append(currentHumidity)

        var currentUvi = document.createElement('h5');
        currentUvi.setAttribute('class', 'text-warning w-75')
        var grabCurrentUvi = data.current.uvi;
        currentStats.append(currentUvi)

        var circleDiv = document.createElement('div')
        circleDiv.setAttribute('class', 'col-1 d-flex flex-wrap align-items-center justify-content-start')
        current.append(circleDiv);
        // uv index circle that changes color based on uv index
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
        circleDiv.append(currentUviCircle)

        var currentWind = document.createElement('h5');
        currentWind.setAttribute('class', 'text-warning w-100')
        var grabCurrentWind = data.current.wind_speed;
        currentWind.textContent = "Wind Speed: " + grabCurrentWind + " mph";
        currentStats.append(currentWind)

    })
}
//takes in data from an earlier api call and generates the elements for the 5 day forecast drop down.
function fiveDayForecast(data){
    var forecastDiv = document.createElement('div')
    forecastDiv.setAttribute('class', 'forecastDiv row justify-content-between pt-2 pl-4')
    currentContainer.append(forecastDiv)
    for (let i = 1; i <= 5; i++){
        
        var dayCard = document.createElement('div')
        dayCard.setAttribute('class','dayCard col-5 col-md-2 col-lg-2 pl-2')
        forecastDiv.appendChild(dayCard)
        // the day of the week
        var day = document.createElement('h5')
        dayValue = moment.unix(data.daily[i].dt).utc();
        day.textContent = moment(dayValue._d).format('dddd')
        day.setAttribute('class', 'text-dark')
        dayCard.append(day);
        
        var dayTemp = document.createElement('h1')
        dayTemp.textContent = Math.floor((data.daily[i].feels_like.day - 273.15) * 9 / 5 + 32) + "°";
        dayTemp.setAttribute('class', 'w-50 text-warning')
        dayCard.append(dayTemp)

        var weatherIcon = document.createElement('img');
        weatherIcon.setAttribute('class','weatherIcon w-50')
        var grabIcon = data.daily[i].weather[0].icon;
        weatherIcon.src = "http://openweathermap.org/img/wn/" + grabIcon + "@2x.png"
        dayCard.append(weatherIcon)

        var dayWind = document.createElement('p')
        dayWind.textContent = "Wind: " + Math.floor(data.daily[i].wind_speed) + "mph";
        dayCard.append(dayWind)

        var dayHumidity = document.createElement('p')
        dayHumidity.textContent = "Humidity: " + data.daily[i].humidity + "%";
        dayCard.append(dayHumidity)
    }
    forecastDiv.setAttribute('style','display: none;')
}
// initializer
function init(){
    updateTime();
    citySearch();
}

init();
// this one sent the text in the search box to the api call within citySearch
submitBtn.addEventListener("click", function(){
    var forecastDiv = document.querySelector('.forecastDiv')
    var current = document.querySelector('.current');
    var responseText = document.querySelector('.responseText')
    if (responseText) {
        responseText.remove();
    }
    if (current && forecastDiv) {
        forecastDiv.remove();
        current.remove();
        citySearch();
        citySearchText.value = ""
    }
});
// this one takes in an enter key for the search bar and sends it to the same location as the event listener above
document.addEventListener('keyup', function(event){
    var target = event.key;
    var current = document.querySelector('.current');
    var forecastDiv = document.querySelector('.forecastDiv')
    var responseText = document.querySelector('.responseText')
    if (responseText) {
        responseText.remove();
    }
    if (target === "Enter" && !forecastDiv){
        citySearch();
    } else if (target === "Enter" && forecastDiv && current){
        current.remove();
        forecastDiv.remove();
        citySearch();
        citySearchText.value = ""
    }
})
// displays the 5 day forecast dropdown
document.addEventListener("click", function (event){
    var forecastDiv = document.querySelector('.forecastDiv')
        if (event.target.id === "weeklyForecast") {
            if (forecastDiv.style.display === "none"){
                forecastDiv.setAttribute('style','display: flex;')
            } else {
                forecastDiv.setAttribute('style','display: none;')
            }   
        }
        if (event.target.id === "city-name"){
            console.log(event.target.textContent)
            var cityName = event.target.textContent;
            console.log(cityName)
            citySearch(cityName);
        }
})

