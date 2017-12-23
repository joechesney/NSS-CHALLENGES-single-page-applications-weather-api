"use strict";

const getKey = function(file){
  return new Promise(function(resolve, reject){
    let keyRequest = new XMLHttpRequest();
    let aK;
    keyRequest.open("GET", file);
    keyRequest.addEventListener("load", function(){
      if(keyRequest.status < 400){
        aK = JSON.parse(keyRequest.response).key;
        console.log(aK);
        resolve(aK);
      }
    });
    keyRequest.send();  
  });
};

const getWeather = function(){
  let weatherData = new Promise(function(resolve, reject){
    let key = getKey('../apiKey.json');
    let weatherXHR = new XMLHttpRequest();
    key.then( function(data){
      console.log("before open",data);
      weatherXHR.open("GET", `http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=${data}`);
      weatherXHR.send();
    });
    weatherXHR.addEventListener("load", function(){
      let weather = JSON.parse(weatherXHR.responseText);
      console.log("event", weather);
      console.log("inside event listener",key);    
      resolve(weather);
    });
  });
};
getWeather();

const printWeather = function(){

};
// http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={APIKEY}