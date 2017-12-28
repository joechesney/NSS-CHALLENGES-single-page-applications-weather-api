"use strict";
const inputBox = document.getElementById("input");
const stateSelector = document.getElementById("state");
const submitButton = document.getElementById("input-button");
const forecastTypeSelector = document.getElementById("type-of-forecast");

const output = document.getElementById("currentOutput");
const dailyOutput = document.getElementById("dailyOutput");
const locationOutput = document.getElementById("location");
const currentTempOutput = document.getElementById("currentTemp");
const maxTempOutput = document.getElementById("maxTemp");
const minTempOutput = document.getElementById("minTemp");
const descriptionOutput = document.getElementById("description");
const windOutput = document.getElementById("wind");
const humidityOutput = document.getElementById("humidity");

const getKey = function(file){
  return new Promise(function(resolve, reject){
    let keyRequest = new XMLHttpRequest();
    let aK;
    keyRequest.open("GET", file);
    keyRequest.addEventListener("load", function(){
      if(keyRequest.status < 400){
        aK = JSON.parse(keyRequest.response).key;
        resolve(aK);
      }
    });
    keyRequest.send();  
  });
};

const getWeather = function(city, state, type){
  
  return new Promise(function(resolve, reject){
    let key = getKey('../apiKey.json');
    let weatherXHR = new XMLHttpRequest();
    key.then( function(keyData){
      // weatherXHR.open("GET", `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${keyData}`); 
      weatherXHR.open("GET", `http://api.wunderground.com/api/${keyData}/${type}/q/${state}/${city}.json`);
      weatherXHR.send();
    });
    weatherXHR.addEventListener("load", function(){
      let weather = JSON.parse(weatherXHR.response);
      console.log("event", weather);
      resolve(weather);
    });
    
  });
};

const printWeather = function(){
  let city = inputBox.value;
  let state = stateSelector.value;
  let type = forecastTypeSelector.value;
  if(type === "conditions"){
    let x = "weatherData.current_observation";
    getWeather(city, state, type).then(function(weatherData){
      console.log(weatherData);
      locationOutput.innerHTML = weatherData.current_observation.display_location.full;
      currentTempOutput.innerHTML = `${weatherData.current_observation.temp_f}&deg;`;
      descriptionOutput.innerHTML = weatherData.current_observation.weather;
      windOutput.innerHTML = `Wind: ${weatherData.current_observation.wind_mph}, ${weatherData.current_observation.wind_dir}`;
      humidityOutput.innerHTML = `Humidity: ${weatherData.current_observation.relative_humidity}`;
      
      // descriptionOutput.style.backgroundImage = `url('${weatherData.current_observation.icon_url}')`;
      // descriptionOutput.style.height = "50px";
      // descriptionOutput.style.backgroundRepeat = "no-repeat";
      let icon = document.createElement("img");
      icon.src = `${weatherData.current_observation.icon_url}`;
      output.appendChild(icon);
    });

  } else if(type === "forecast" || type === "forecast10day"){
    getWeather(city, state, type).then(function(weatherData){  
      weatherData.forecast.simpleforecast.forecastday.forEach(function(day){
        let weatherCard = "<div class='dayCard'>";
        weatherCard += `<div class='center'>${day.date.weekday}</div> `;
        weatherCard += `<div class='lilimg'><img src='${day.icon_url}'></div>`;
        weatherCard += `<div>High: ${day.high.fahrenheit}&deg;F`;
        weatherCard += `<div>Low: ${day.low.fahrenheit}&deg;F`;
        weatherCard += `<div>${day.conditions}</div>`;

        weatherCard += "</div>";        
        dailyOutput.innerHTML += weatherCard;
      });
    });
  } else if(type === "hourly"){
    getWeather(city, state, type).then(function(weatherData){ 
      dailyOutput.innerHTML = `${weatherData.hourly_forecast[0].weekday_name}`; 
      weatherData.hourly_forecast.forEach(function(hour){
        let weatherCard = "<div class='hourCard'>";
        weatherCard += `<div class='center'>${hour.FCTTIME.civil}</div> `;
        weatherCard += `<div class='lilimg'><img src='${hour.icon_url}'></div>`;
        weatherCard += `<div>${hour.temp.english}</div>`;
        weatherCard += `<div>${hour.condition}</div>`;

        weatherCard += "</div>";        
        dailyOutput.innerHTML += weatherCard;
      });
    });
  }
};



submitButton.addEventListener("click", function() {
  printWeather();
});
inputBox.addEventListener("keyup", function(e) {
  if(e.keyCode === 13){
    printWeather();
  }
});

//"75d5046b24a7a2f8106b0879bd41f129"