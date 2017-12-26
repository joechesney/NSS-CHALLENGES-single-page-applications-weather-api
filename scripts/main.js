"use strict";
const inputBox = document.getElementById("input");
const stateSelector = document.getElementById("state");
const submitButton = document.getElementById("input-button");
const output = document.getElementById("output");
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

const getWeather = function(city, state){
  return new Promise(function(resolve, reject){
    let key = getKey('../apiKey.json');
    let weatherXHR = new XMLHttpRequest();
    key.then( function(keyData){
      // weatherXHR.open("GET", `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${keyData}`); 
      weatherXHR.open("GET", `http://api.wunderground.com/api/${keyData}/conditions/q/${state}/${city}.json`);
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
  let x = "weatherData.current_observation";
  getWeather(city, state).then(function(weatherData){
    console.log(weatherData);
    locationOutput.innerHTML = weatherData.current_observation.display_location.full;
    currentTempOutput.innerHTML = weatherData.current_observation.temp_f;
    // minTempOutput.innerHTML = weatherData.current_observation.feelslike_f;
    // maxTempOutput.innerHTML = weatherData.current_observation.feelslike_f;
    descriptionOutput.innerHTML = weatherData.current_observation.weather;
    windOutput.innerHTML = weatherData.current_observation.wind_mph + weatherData.current_observation.wind_dir;
    humidityOutput.innerHTML = weatherData.current_observation.relative_humidity;
    // min
    // max
    //descr
    // wind
    //humid
    descriptionOutput.style.backgroundImage = `url('${weatherData.current_observation.icon_url}')`;
    descriptionOutput.style.height = "50px";
    descriptionOutput.style.backgroundRepeat = "no-repeat";
    let icon = document.createElement("img");
    icon.src = `${weatherData.current_observation.icon_url}`;
    output.appendChild(icon);
  });
  
};

submitButton.addEventListener("click", function() {
  printWeather();
});

//"75d5046b24a7a2f8106b0879bd41f129"