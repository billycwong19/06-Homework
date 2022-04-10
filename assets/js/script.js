var searchCard = document.querySelector('.searchCard')
var submitBtn = document.querySelector('.submitBtn')
var dateAndTime = document.querySelector('.dateAndTime')
var currentContainer = document.querySelector('.currentContainer')
var citySearchText = document.querySelector('.citySearchText')

var updateTime = function() {
    dateAndTime.textContent = moment().format('MMMM Do YYYY, h:mm:ss a');
    }
setInterval(updateTime, 1000);

function citySearch(){
    
    var cityName;
    var current = document.querySelector('.current');
    if (current) {
        current.remove();
        console.log(citySearchText.value[0])
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
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&units=imperial&appid=a976a17f2929049a5c3d9fd40c354e20")
    .then(function (response) {
        return response.json();
    })
        .then(function (data) {
            console.log(data)
            var cityLat = data[0].lat;
            var cityLon = data[0].lon;
            var cityName = data[0].name;
            console.log(cityLat, cityLon, cityName)
            weatherSearch(cityLat, cityLon, cityName)
    })
}

function zipCodeSearch(zipCode){
    fetch("http://api.openweathermap.org/geo/1.0/zip?zip=" + zipCode + "&units=imperial&appid=a976a17f2929049a5c3d9fd40c354e20")
    .then(function (response) {
        if (response.status !== 200) {
            var responseText = document.createElement('h1')
            responseText.textContent = response.status + " ops! Try again!";
            currentContainer.append(responseText)
        }
        return response.json();
    })
        .then(function (data) {
            console.log(data)
            var cityLat = data.lat;
            var cityLon = data.lon;
            var cityName = data.name
            weatherSearch(cityLat, cityLon, cityName)
    })
}

function weatherSearch(cityLat, cityLon, cityName) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "& units=imperial&appid=a976a17f2929049a5c3d9fd40c354e20")
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
            console.log(data)
        var current = document.createElement('div')
        current.setAttribute('class', 'current row p-3')
        currentContainer.append(current)

        var cityCard = document.createElement('div')
        cityCard.setAttribute('class','col-8')
        current.append(cityCard)

        var city = document.createElement('h2');
        city.textContent = cityName;
        cityCard.append(city)

        var currentTemp = document.createElement('h1');
        var grabCurrentFar = (data.current.temp - 273.15) * 9 / 5 + 32;
        currentTemp.textContent = Math.floor(grabCurrentFar) + "°"
        cityCard.append(currentTemp)
        
        var feelsLikeTemp = document.createElement('h5');
        var grabFeelsLike = (data.current.feels_like - 273.15) * 9 / 5 + 32;
        feelsLikeTemp.textContent = "Feels like " + Math.floor(grabFeelsLike) + "°"
        cityCard.append(feelsLikeTemp)

        var weatherDescription = document.createElement('h6');
        var grabDescription = data.current.weather[0].description;
        weatherDescription.textContent = grabDescription;
        cityCard.append(weatherDescription)

        var weatherIcon = document.createElement('img');
        weatherIcon.setAttribute('class','col-3')
        var grabIcon = data.current.weather[0].icon;
        weatherIcon.src = "http://openweathermap.org/img/wn/" + grabIcon + "@2x.png"
        current.append(weatherIcon)
      })
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


// searchCard.addEventListener("submit", search)

// dynamically generate text input to update cities list