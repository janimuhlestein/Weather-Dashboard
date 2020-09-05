//Weather-burea refactored

//all global variables needed
var latLong = [];
var cityList = document.querySelector("#list");
var cityInfo = document.querySelector("body > div > div > div.col-8.col-med-8.col-group > div.city-info");
var openWeatherkey = "98f23d6fdb06b2a3aa07cb0cfaea85fa";
var mapQuestKey = "amsewn3dIc8O6SBBpZwBJA8MxuG5sG7B";
var sunIcon = "assets/images/iconfinder_sun_3233848.png";
var partCloudIcon = "assets/images/iconfinder_sunny_3233850.png";
var mostlyCloudyIcon = "assets/images/iconfinder_cloudy_3233857.png";
var rainIcon = "assets/images/iconfinder_rain_3233856.png";
var lightIcon = "assets/images/iconfinder_lightning_3233854.png";
var clearMoonIcon = "assets/images/iconfinder_moon_3233852.png";
var cloudyMoonIcon = "assets/images/iconfinder_moon-cloud_3233853.png";
var snowIcon = "assets/images/iconfinder_snow_3233849.png";
var nightCloudyIcon = "assets/images/iconfinder_weather_40_2682811.png";
var nightRainIcon = "assets/images/iconfinder_weather_18_2682833.png";
var nightThunderIcon = "assets/images/iconfinder_weather_25_2682826.png";
var ltRainIcon = 'assets/images/iconfinder_weather_14_2682837.png';
var ltRainNightIcon = "assets/images/iconfinder_weather_25_2682826.png";
var hazeIcon = "assets/images/iconfinder_weather_30_2682821.png";
var cities = [];
var myStorage = window.localStorage;
var cityCard = document.querySelector("#cityCard");
var input = document.querySelector("#cityName");

//on submit, run the whole thing
$("#btnSubmit").on("click", function(){
    var cityName = $(input).val().trim();
    clearInfo();
    getLatLong(cityName);
 });

 //on enter in input form
input.addEventListener("keyup", function(event){
    //if they press enter, then, get data and display
    if(event.keyCode === 13) {
        var cityName = $(input).val().trim();
        clearInfo();
        getLatLong(cityName);
    
    }
});
 

var getLatLong = function(cityName) {
    //first, get the latitude and longitude of the desired city from mapQuest
    //once we have them, get the weather information
    var mQapiUrl = "https://www.mapquestapi.com/geocoding/v1/address?key=" +mapQuestKey + "&location=" + cityName;
    fetch(mQapiUrl).then(function(response){
        //if response was successful
        if(response.ok) {
            response.json().then(function(data){
                console.log(data);

                lat = data.results[0].locations[0].displayLatLng.lat;
                long = data.results[0].locations[0].displayLatLng.lng;
                latLong.push(lat);
                latLong.push(long);
                getWeather(latLong, cityName);
                //clear out latLong;
                latLong = [];
            });
        }
        else {
            alert("There was a problem with your MapQuest request");
        }
        })
        .catch(function(error) {
            alert("Unable to connect to the mapQuest server");
        });
};

var getWeather = function(latLong, cityName) {
    //if we've got the latitude and longitude, get the weather data
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latLong[0] + "&lon=" + latLong[1] + "&exclude=hourly,minute&appid=" + openWeatherkey + "&units=imperial";
    fetch(weatherApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                //return data;
                displayData(data, cityName);
            });
        }
    else {
        alert("There was a problem with your OpenWeather request");
     }
    })
    .catch(function(error) {
        alert("Unable to contact the OpenWeather server")
    });
};

var displayData = function(data, cityName) {
    //start by adding in current city name and date and current icon
   // var cityName = $(input).val().trim();
    var name = document.createElement("h2");
    name.setAttribute("class", "cityName");
    name.textContent = cityName
    cityInfo.appendChild(name);
    var date = moment().format("MM/DD/YYYY");
    var description = data.current.weather[0].description
    var iconPath = setIconPath(description);
    name.innerHTML = cityName + " " + date + " " + "<span><img src='" +iconPath + "'></img></span>";
    //get current temp, wind, and humidity
    var temp = document.createElement("p");
    temp.setAttribute("class", "details");
    temp.textContent = "The current temperature is: " + data.current.temp + "\xB0"+ " F";
    cityInfo.appendChild(temp);
    var humidity = document.createElement("p");
    humidity.setAttribute("class", "details");
    humidity.textContent = "The current humidity is: " + data.current.humidity + "%";
    cityInfo.appendChild(humidity);
    var wind = document.createElement("p");
    wind.setAttribute("class", "details");
    wind.textContent = "The wind speed is: " + data.current.wind_speed + " MPH";
    cityInfo.appendChild(wind);
    //get UV info
    var uvInfo = data.current.uvi;
    var uvIndexEl = document.createElement("p");
    uvIndexEl.setAttribute("class", "details");
        if(parseInt(uvInfo)<3) {
            uvIndexEl.innerHTML = "The UV Index is: <span class = 'uv-favorable'>" + uvInfo + "</span>";
         }
        else if(parseInt(uvInfo)<6) {
            uvIndexEl.innerHTML = "The UV Index is: <span class = 'uv-moderate'>" +uvInfo + "</span>";
        }
        else {
            uvIndexEl.innerHTML = "The UV Index is: <span class = 'uv-high'>" + uvInfo + "</span>";
         }
        cityInfo.appendChild(uvIndexEl);
    //display first forecast day info
    //first, let's do a for and see if we can make this a little easier
    for(var i = 0; i<5; i++) {
        var day = "d"+i;
        console.log(day);
        var dayContainerEl = document.querySelector("#"+day);
        //get date
        var date = moment().add(i, "days");
        dateContent = date.format("MM/DD/YYYY");
        var dateText = document.createElement("p");
        dateText.setAttribute("class", "five-day top");
        dateText.textContent = dateContent;
        dayContainerEl.appendChild(dateText);
        //get icon
         description = data.daily[i].weather[0].description;
        var iconEl = document.createElement("img");
         iconPath = setIconPath(description);
         console.log(iconPath);
         iconEl.setAttribute("src", iconPath);
         dayContainerEl.appendChild(iconEl);
        //get temp
        var tempData = data.daily[i].temp.day;
        var tempText = document.createElement("p");
        tempText.setAttribute("class", "five-day");
        tempText.textContent= tempData + "\xB0"+ " F";
        dayContainerEl.appendChild(tempText);
        //get humidity
        var humidityData = data.daily[i].humidity;
        var humidityText = document.createElement("p");
        humidityText.setAttribute("class", "five-day");
        humidityText.textContent = humidityData + "%";
        dayContainerEl.appendChild(humidityText);
    }
    addCity(cityName);
    //clear the input
    $(input).val("");
};

var addCity = function(cityName) {
    //if they enter a name, let's add a div, and remember it
    //first, verify that it's not already there, and that there are only 10 cities
    var list = JSON.parse(myStorage.getItem("cities"));
    if(!list) {
        //if there's nothing existing, make an empty array to accept it.
        cities = [];
    }
    else if(list.includes(cityName)) {
        //if it's there, forget about it
        return false;
    }
    else {
        if(cities.length ===9) {
            //if they have 10 cities, pop the first, so we can add another
            cities.pop[0];
        }
    }
    var name = document.createElement("p");
    name.setAttribute("class", "cityCard");
    name.textContent = cityName;
   cityList.appendChild(name);
   cities.push(cityName);
   myStorage.setItem("cities", JSON.stringify(cities));

};

var loadCities = function() {
    //get cities from storage
   cities = JSON.parse(myStorage.getItem("cities"));
    if(!cities){
        //if we have no cities in storage, don't worry about it
        //create a blank variable for future storage
        cities = [];
        return false;
    }
    //else, load the cities
    for(var i = 0; i < cities.length; i++) {

        var cityName = document.createElement("p");
        cityName.setAttribute("class", "cityCard");
        cityName.textContent = cities[i];
        cityList.appendChild(cityName);
    }
};

var setIconPath = function(description) {
    //get current time and weather description
   //Note: I could have used the icons from open weather, but I didn't like them, so I found 
   //cuter ones!
    console.log(description);
    var time = moment().hours();
    time = parseInt(time);
    var iconPath;
    if(time <= 18 && description === "overcast clouds" || description === "broken clouds" || description === "haze") {
        iconPath = mostlyCloudyIcon;
    }
    else if( time > 18 && description === "overcast clouds" || description === "broken clouds" || description === "haze") {
        iconPath = nightCloudyIcon;
    }
    else if(time <= 18 && description === "rainy" || description === "heavy intensity rain"){
    iconPath = rainIcon;
    }
    else if(time > 18 && description === "rainy" || description === "heavy intensity rain") {
        iconPath = nightRainIcon;
    }
    else if(time <= 18 && description === "few clouds" || description === "scattered clouds") {
        iconPath = partCloudIcon;
    }
    else if(time > 18 && description === "few clouds" || description === "scattered clouds") {
        iconPath = cloudyMoonIcon;
    }
    if(time < 18 && description === "clear sky") {
        iconPath = sunIcon;
    }
    else if (time >= 18 && description === "clear sky") {
        iconPath = clearMoonIcon;
    }
    else if(time < 18 && description === "thunderstorm") {
        iconPath = lightIcon;
    }
    else if(time >=18 && description === "thunderstorm") {
        iconPath = nightThunderIcon;
    }
    else if(time < 18 && description === "light rain" || description === "moderate rain") {
        iconPath = ltRainIcon;
    }
    else if(time >= 18 && description === "light rain" || description === "moderate rain") {
        iconPath = ltRainNightIcon;
    }
    return iconPath;
};

var clearInfo = function() {
    cityInfo.innerHTML = "";
    var first = document.querySelector("#d0");
    first.innerHTML = "";
    var second = document.querySelector("#d1");
    second.innerHTML = "";
    var third  = document.querySelector("#d2");
    third.innerHTML = "";
    var fourth = document.querySelector("#d3");
    fourth.innerHTML = "";
    var fifth = document.querySelector("#d4");
    fifth.innerHTML = "";
    $(input).val("");

}

$("#btnClear").on("click", function(){
    //clear all info, and then, cear out the local storage
    clearInfo();
    myStorage.removeItem("cities");
    //after we've cleared storage, clear out the city list
    list = document.querySelector("#list");
    list.innerHTML = "";
});

loadCities();

//if they click on a city name, display it's info
$(".cityCard").on("click", function() {
    debugger;
//clear out previous results
clearInfo();
var cityName = $(this).text().trim();
getLatLong(cityName);
    
});