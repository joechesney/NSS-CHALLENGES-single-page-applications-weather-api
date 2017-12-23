"use strict";
const citySelector = document.getElementById("city");
const weatherOutput = document.getElementById("output");
const submitButton = document.getElementById("city-button");

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

const getWeather = function(city){
  let weatherData = new Promise(function(resolve, reject){
    let key = getKey('../apiKey.json');
    let weatherXHR = new XMLHttpRequest();
    key.then( function(keyData){
      // weatherXHR.open("GET", `http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=${data}`);
      weatherXHR.open("GET", `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${keyData}`);      
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
  let city = citySelector.value;
  console.log(getWeather(city));
  // getWeather(city).then(function(info){
  //   console.log("info", info);
  // });
  // console.log("bunchOfWeather",bunchOfWeather);
  let temperatureDiv = document.createElement("div");

  weatherOutput.innerHTML = city;
};
//api.openweathermap.org/data/2.5/weather?q={city name}

submitButton.addEventListener("click", function() {
  printWeather();
});