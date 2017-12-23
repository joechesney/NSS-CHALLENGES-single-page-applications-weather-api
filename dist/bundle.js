(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1]);
