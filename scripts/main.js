"use strict";
const citySelector = document.getElementById("city-selector");
const stateSelector = document.getElementById("state-selector");
const submitButton = document.getElementById("submit-button");
const forecastTypeSelector = document.getElementById("type-of-forecast");

const weatherOutput = document.getElementById("weatherOutput");
const weatherHeading = document.getElementById("weatherHeading");

//  model
const getKey = function(file){
  return new Promise(function(resolve, reject){
    let keyRequest = new XMLHttpRequest();
    let aK;
    keyRequest.open("GET", file);
    keyRequest.addEventListener("load", function(){
      if(keyRequest.status < 400){
        aK = JSON.parse(keyRequest.response).theKey;
        resolve(aK);
      }
    });
    keyRequest.send();  
  });
};
// controller
const getWeather = function(city, state, type){
  return new Promise(function(resolve, reject){
    let key = getKey('../apiKey.json');
    let weatherXHR = new XMLHttpRequest();
    key.then(function(keyData){
      // weatherXHR.open("GET", `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${keyData}`); 
      // weatherXHR.open("GET", `http://api.wunderground.com/api/${keyData}/${type}/q/${state}/${city}.json`);
      weatherXHR.open("GET", "../hourlytestweather.json");
      weatherXHR.send();
    });
    weatherXHR.addEventListener("load", function(){
      let weather = JSON.parse(weatherXHR.response);
      console.log("event", weather);
      resolve(weather);
    });
  });
};

// view
const printWeather = function(){
  weatherOutput.innerHTML = "";
  let city = citySelector.value;
  let state = stateSelector.value;
  let type = forecastTypeSelector.value;
  if(city === "" || state === ""){
    alert("All fields are required. Please enter a city and state please.");
    return;
  }
  if(type === "conditions"){
    getWeather(city, state, type).then(function(weatherData){
      weatherHeading.innerHTML = `<h2>${weatherData.current_observation.observation_time_rfc822}</h2>`;            
      let currentWeather = `<div class='currentWeather'>`;
      currentWeather += `<div><strong>${weatherData.current_observation.display_location.full}</strong><div>`;
      currentWeather += `<img class='' src='${weatherData.current_observation.icon_url}'>`;
      currentWeather += `<div class=''>Currently: ${weatherData.current_observation.temp_f}&deg;F</div>`;
      currentWeather += `<div class=''>${weatherData.current_observation.weather}`;
      currentWeather += `<div class=''> Wind: ${weatherData.current_observation.wind_dir}, at ${weatherData.current_observation.wind_mph}mph`;
      currentWeather += `<div class=''>Humidity: ${weatherData.current_observation.relative_humidity}`;
      weatherOutput.innerHTML = currentWeather;
    });
  } else if(type === "forecast" || type === "forecast10day"){
    getWeather(city, state, type).then(function(weatherData){  
      weatherHeading.innerHTML = '';      
      weatherData.forecast.simpleforecast.forecastday.forEach(function(day){
        let weatherCard = "<div class='dayCard'>";
        weatherCard += `<div class='center'>${day.date.weekday}</div> `;
        weatherCard += `<div class='lilimg'><img src='${day.icon_url}'></div>`;
        weatherCard += `<div>High: ${day.high.fahrenheit}&deg;F`;
        weatherCard += `<div>Low: ${day.low.fahrenheit}&deg;F`;
        weatherCard += `<div>${day.conditions}</div>`;
        weatherCard += "</div>";        
        weatherOutput.innerHTML += weatherCard;
      });
    });
  } else if(type === "hourly"){
    getWeather(city, state, type).then(function(weatherData){ 
      weatherOutput.innerHTML = '';
      weatherHeading.innerHTML = `<h2>${weatherData.hourly_forecast[0].FCTTIME.weekday_name}</h2><br>`; 
      weatherData.hourly_forecast.forEach(function(hour){
        let weatherCard = "<div class='hourCard'>";
        weatherCard += `<div class='center'>${hour.FCTTIME.civil}</div> `;
        weatherCard += `<img src='${hour.icon_url}'>`;
        weatherCard += `<div>${hour.temp.english}&deg;F</div>`;
        weatherCard += `<div>${hour.condition}</div>`;
        weatherCard += "</div>";        
        weatherOutput.innerHTML += weatherCard;
      });
    });
  }
};

// controller
submitButton.addEventListener("click", function() {
  printWeather();
});
const enterPress = function(e){
  if(e.keyCode === 13){
    printWeather();
  }
};
citySelector.addEventListener("keyup", enterPress);
stateSelector.addEventListener("keyup", enterPress);
forecastTypeSelector.addEventListener("keyup", enterPress);

