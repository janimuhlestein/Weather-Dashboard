//todo add code

var cityList = document.querySelector("#list");
var cityInfo = document.querySelector("body > div > div > div.col-8.col-med-8.col-group > div.city-info");
var key = "98f23d6fdb06b2a3aa07cb0cfaea85fa";
var sunIcon = "assets/images/iconfinder_sun_3233848.png";
var partCloudIcon = "assets/images/iconfinder_sunny_3233850.png";
var mostlyCloudyIcon = "assets/images/iconfinder_cloudy_3233857.png";
var rainIcon = "assets/images/iconfinder_rain_3233856.png";
var lightIcon = "assets/images/iconfinder_lightning_3233854.png";
var clearMoonIcon = "assets/images/iconfinder_moon_3233852.png";
var cloudyMoonIcon = "assets/images/iconfinder_moon-cloud_3233853.png";
var snowIcon = "assets/images/iconfinder_snow_3233849.png";
var cities = [];
var myStorage = window.localStorage;

//On click, get the current temp info for the city
var getCurrent = function(cityName) {
     //get the city name
   //var cityName = $("#cityName").val().trim();
   var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + key + "&units=imperial";
    fetch(apiUrl).then(function(response){
    //if response was successful
    if(response.ok) {
        response.json().then(function(data){
            console.log(data);
            displayCurrentDate(data);
        });
    }
    else {
        alert("There was a problem with your request");
    }
});

};


$("#btnSubmit").on("click", function(){
    //clear everything, if there's anything there
    clearInfo();
    //get the city
    var cityName = $("#cityName").val().trim();
    //get current conditions
    getCurrent(cityName);
    //get the five day forecast data
    getFiveDay(cityName);
    //after everything, add the city to the list of cities
    addCity(cityName);
});

var displayCurrentDate = function(data) {
    //get the appropriate icon
    //NOTE: I can find the openweathermap icons, but I don't like them, so I found others
    //var icon = data.weather[0].icon;
   // var iconPath = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
   var iconPath = setCurrentIcon(data);
   console.log(iconPath);
    var icon = document.createElement("span");
    icon.setAttribute("img", iconPath);
    var name = document.createElement("p");
    name.setAttribute("class", "cityName");
    var date = moment().format("MM/DD/YYYY");
    name.innerHTML = data.name + " " + date + " " + "<span><img src='" +iconPath + "'></img></span>";
    //name.innerHTML = data.name;
    cityInfo.appendChild(name);
    var temp = document.createElement("p");
    temp.setAttribute("class", "details");
    temp.textContent = "The current temperature is: " + data.main.temp + "\xB0"+ " F";
    cityInfo.appendChild(temp);
    var humidity = document.createElement("p");
    humidity.setAttribute("class", "details");
    humidity.textContent = "The current humidity is: " + data.main.humidity + "%";
    cityInfo.appendChild(humidity);
    var wind = document.createElement("p");
    wind.setAttribute("class", "details");
  //  rain.textContent = "the rain is: " + data.weather[0].description;
    wind.textContent = "The wind speed is: " + data.wind.speed + " MPH";
    cityInfo.appendChild(wind);
    //get the uvIndex;
    getUVIndev(data);
};

var addCity = function(cityName) {
    //if they enter a name, let's add a div, and remember it
    var name = document.createElement("p");
    name.setAttribute("class", "cityList cityCard");
    name.textContent = cityName;
   cityList.appendChild(name);
   console.log(cities);
   // cities = [];
   cities.push(cityName);
   console.log(cities);
   myStorage.setItem("cities", JSON.stringify(cities));
};

var loadCities = function() {
   cities = JSON.parse(myStorage.getItem("cities"));
   //cities = JSON.parse(cities);
   console.log(cities);
    if(!cities){
        //if we have no cities in storage, don't worry about it
        //create a blank variable for future storage
        cities = [];
        return false;
    }
    //else, load the cities
    for(var i = 0; i < cities.length; i++) {

        var cityName = document.createElement("p");
        cityName.setAttribute("class", "cityList");
        cityName.setAttribute("id", "cityCard");
        cityName.textContent = cities[i];
        cityList.appendChild(cityName);
    }
};

$("#btnClear").on("click", function(){
    clearInfo();

});

var getUVIndev = function(cityData) {
    var lat = cityData.coord.lat;
    var lon = cityData.coord.lon;
    var apiURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + lat + "&lon=" + lon;
    fetch(apiURL).then(function(response){
        //if response was successful
        if(response.ok) {
            response.json().then(function(data){
                var index = data.value;
                var uvIndex = document.createElement("p");
                uvIndex.setAttribute("class", "details");
                if(parseInt(index)<3) {
                    uvIndex.innerHTML = "The UV Index is: <span class = 'uv-favorable'>" + index + "</span>";
                }
                else if(parseInt(index)<6) {
                    uvIndex.innerHTML = "The UV Index is: <span class = 'uv-moderate'>" +index + "</span>";
                }
                else {
                    uvIndex.innerHTML = "The UV Index is: <span class = 'uv-high'>" + index + "</span>";
                }
               // uvIndex.textContent = "UV Index is: " + index;
                cityInfo.appendChild(uvIndex);;
            });
        }
        else {
            alert("There was a problem with your request");
        }
    });
};

var getFiveDay = function(city) {
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" +city + "&appid=" + key + "&units=imperial";
    fetch(apiURL).then(function(response){
        //if response was successful
        if(response.ok) {
            response.json().then(function(data){
                console.log(data);
                //display the first day
               getFirstDay(data);
               //display the second day
               getSecondDay(data);
               //display the third day
               getThirdDay(data);
               //display the fourth day
               getFourthDay(data);
               //display the fifth day
               getFifthDay(data);
            });
        }
        else {
            alert("There was a problem with your request");
        }
    });
};

var getFirstDay = function(data) {
    //get the first, and display it
    var day = document.querySelector("#first-day");
    var datePlus = moment().add(1, "days");
    var date = document.createElement("p");
    date.setAttribute("class", "five-day top");
    date.textContent = datePlus.format("MM/DD/YYYY");
    day.appendChild(date);
    dateList = datePlus.format("YYYY-MM-DD");
    for(var i = 0; i<data.list.length; i++) {
        //list[3].dt_txt
        var dtTime = data.list[i].dt_txt;
        if(dtTime === dateList + " 12:00:00") {
        //get the iconList
        //var iconList = data.list[i].weather[0].icon;
        //var iconPath = "http://openweathermap.org/img/wn/" + iconList + "@2x.png"
        var iconPath = setForecastIcon(data, i);
        var icon = document.createElement("img");
        icon.setAttribute("class", "five-day img");
        icon.setAttribute("src", iconPath);
        day.appendChild(icon); 
        
        //get the temp
        var temp = document.createElement("p");
        temp.setAttribute("class", "five-day");
        temp.textContent = "Temp: " + data.list[i].main.temp  + "\xB0"+ " F";
        day.appendChild(temp);
        //add humidity
        var humidity = document.createElement("p");
        humidity.setAttribute("class", "five-day");
        humidity.textContent = "Humidity: " + data.list[i].main.humidity;
        day.appendChild(humidity);

        }
    }
};

var getSecondDay = function(data) {
    //get the second day, and display it
    var day = document.querySelector("#second-day");
    var datePlus = moment().add(2, "days");
    var date = document.createElement("p");
    date.setAttribute("class", "five-day top");
    date.textContent = datePlus.format("MM/DD/YYYY");
    day.appendChild(date);
    //get the icon
    dateList = datePlus.format("YYYY-MM-DD");
    for(var i = 0; i<data.list.length; i++) {
        //list[3].dt_txt
        var dtTime = data.list[i].dt_txt;
        if(dtTime === dateList + " 12:00:00") {
        //get the iconList
        //var iconList = data.list[i].weather[0].icon;
        console.log(data.list[i].weather[0].description);
        var iconPath = setForecastIcon(data,i);
        //var iconPath = "http://openweathermap.org/img/wn/" + iconList + "@2x.png"
        var icon = document.createElement("img");
        icon.setAttribute("class", "five-day img");
        icon.setAttribute("src", iconPath);
        day.appendChild(icon); 
        
        //get the temp
        var temp = document.createElement("p");
        temp.setAttribute("class", "five-day");
        temp.textContent = "Temp: " + data.list[i].main.temp  + "\xB0"+ " F";
        day.appendChild(temp);
        //add humidity
        var humidity = document.createElement("p");
        humidity.setAttribute("class", "five-day");
        humidity.textContent = "Humidity: " + data.list[i].main.humidity;
        day.appendChild(humidity);

        }
    }
};

var getThirdDay = function(data) {
    //get the second day, and display it
    var day = document.querySelector("#third-day");
    var datePlus = moment().add(3, "days");
    var date = document.createElement("p");
    date.setAttribute("class", "five-day top");
    date.textContent = datePlus.format("MM/DD/YYYY");
    day.appendChild(date);
    //get the icon
    dateList = datePlus.format("YYYY-MM-DD");
    for(var i = 0; i<data.list.length; i++) {
        var dtTime = data.list[i].dt_txt;
        if(dtTime === dateList + " 12:00:00") {
        //get the iconList
        //var iconList = data.list[i].weather[0].icon;
        //var iconPath = "http://openweathermap.org/img/wn/" + iconList + "@2x.png"
        var iconPath = setForecastIcon(data,i);
        var icon = document.createElement("img");
        icon.setAttribute("class", "five-day img");
        icon.setAttribute("src", iconPath);
        day.appendChild(icon); 
        
        //get the temp
        var temp = document.createElement("p");
        temp.setAttribute("class", "five-day");
        temp.textContent = "Temp: " + data.list[i].main.temp  + "\xB0"+ " F";
        day.appendChild(temp);
        //add humidity
        var humidity = document.createElement("p");
        humidity.setAttribute("class", "five-day");
        humidity.textContent = "Humidity: " + data.list[i].main.humidity;
        day.appendChild(humidity);

        }
    }
};

var getFourthDay = function(data) {
    //get the second day, and display it
    var day = document.querySelector("#fourth-day");
    var datePlus = moment().add(4, "days");
    var date = document.createElement("p");
    date.setAttribute("class", "five-day top");
    date.textContent = datePlus.format("MM/DD/YYYY");
    day.appendChild(date);
    //get the icon
    dateList = datePlus.format("YYYY-MM-DD");
    for(var i = 0; i<data.list.length; i++) {
        var dtTime = data.list[i].dt_txt;
        if(dtTime === dateList + " 12:00:00") {
        //get the iconList
        //var iconList = data.list[i].weather[0].icon;
        //var iconPath = "http://openweathermap.org/img/wn/" + iconList + "@2x.png"
        var iconPath = setForecastIcon(data,i);
        var icon = document.createElement("img");
        icon.setAttribute("class", "five-day img");
        icon.setAttribute("src", iconPath);
        day.appendChild(icon); 
        
        //get the temp
        var temp = document.createElement("p");
        temp.setAttribute("class", "five-day");
        temp.textContent = "Temp: " + data.list[i].main.temp  + "\xB0"+ " F";
        day.appendChild(temp);
        //add humidity
        var humidity = document.createElement("p");
        humidity.setAttribute("class", "five-day");
        humidity.textContent = "Humidity: " + data.list[i].main.humidity;
        day.appendChild(humidity);

        }
    }
};

var getFifthDay = function(data) {
    //get the second day, and display it
    var day = document.querySelector("#fifth-day");
    var datePlus = moment().add(5, "days");
    var date = document.createElement("p");
    date.setAttribute("class", "five-day top");
    date.textContent = datePlus.format("MM/DD/YYYY");
    day.appendChild(date);
    //get the icon
    dateList = datePlus.format("YYYY-MM-DD");
    for(var i = 0; i<data.list.length; i++) {
        var dtTime = data.list[i].dt_txt;
        if(dtTime === dateList + " 06:00:00") {
        //get the iconList
        //var iconList = data.list[i].weather[0].icon;
        //var iconPath = "http://openweathermap.org/img/wn/" + iconList + "@2x.png"
        var iconPath = setForecastIcon(data,i);
        var icon = document.createElement("img");
        icon.setAttribute("class", "five-day img");
        icon.setAttribute("src", iconPath);
        day.appendChild(icon); 
        
        //get the temp
        var temp = document.createElement("p");
        temp.setAttribute("class", "five-day");
        temp.textContent = "Temp: " + data.list[i].main.temp  + "\xB0"+ " F";
        day.appendChild(temp);
        //add humidity
        var humidity = document.createElement("p");
        humidity.setAttribute("class", "five-day");
        humidity.textContent = "Humidity: " + data.list[i].main.humidity;
        day.appendChild(humidity);

        }
    }
};

var setCurrentIcon = function(data) {
    var iconPath;
    var time = moment().hours();
    time = parseInt(time);
    console.log(time);
    var description = data.weather[0].description;
   if(time < 18 && description === "clear sky") {
       iconPath = sunIcon;
   }
   else if (time > 18 && description === "clear sky") {
       iconPath = clearMoonIcon;
   }
   else if(time < 18 && description === "few clouds" || time < 18 && description === "scattered clouds") {
       iconPath = partCloudIcon;
   }
   else if(time > 18 && description === "few clouds" || time > 18 && description ==="scattered clouds" ) {
       iconPath = cloudyMoonIcon;
   }
   else if(description === "broken clouds" || description === "overcast clouds") {
       iconPath = mostlyCloudyIcon;
   }
   else if(description === "shower rain"|| description === "rain" || description === "light rain" || description === "moderate rain") {
       iconPath = rainIcon;
   }
   else if(description === "thunderstorm") {
       iconPath = lightIcon;
   }
   else if(description === "snow") {
       iconPath = snowIcon;
   }
   return iconPath;
};

var setForecastIcon = function(data, index) {
    var description = data.list[index].weather[0].description;
    var iconPath;
    if(description === "clear sky") {
        iconPath = sunIcon;
    }
    else if(description === "few clouds" || description === "scattered clouds") {
        iconPath = partCloudIcon;
    }
    else if(description === "broken clouds" || description === "overcast clouds") {
        iconPath = mostlyCloudyIcon;
    }
    else if(description === "shower rain"|| description === "rain" || description === "light rain" || description === "moderate rain") {
        iconPath = rainIcon;
    }
    else if(description === "thunderstorm") {
        iconPath = lightIcon;
    }
    else if(description === "snow") {
        iconPath = snowIcon;
    }
    return iconPath;
};

var clearInfo = function() {
    cityInfo.innerHTML = "";
    var first = document.querySelector("#first-day");
    first.innerHTML = "";
    var second = document.querySelector("#second-day");
    second.innerHTML = "";
    var third  = document.querySelector("#third-day");
    third.innerHTML = "";
    var fourth = document.querySelector("#fourth-day");
    fourth.innerHTML = "";
    var fifth = document.querySelector("#fifth-day");
    fifth.innerHTML = "";
}

loadCities();

//if they click on one of the city names, load those
$("#cityCard").on("click", function(){
    //clear out previous results
    clearInfo();
    var cityName = $(this).text().trim();
    console.log(cityName);
    //get current conditions
    getCurrent(cityName);
    //get the five day forecast data
    getFiveDay(cityName);
;

});