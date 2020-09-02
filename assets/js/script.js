//todo add code

var cityInfo = document.querySelector("body > div > div > div.col-8.col-med-8.col-group > div.city-info");
var key = "98f23d6fdb06b2a3aa07cb0cfaea85fa";

//On click, get the current temp info for the city
var getCurrent = function() {
     //get the city name
   var cityName = $("#cityName").val().trim();
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
    //get the city
    var cityName = $("#cityName").val().trim();
    //get current conditions
    getCurrent();
    //get the five day forecast data
    getFiveDay(cityName);
    
    //after everything, add the city to the list of cities
    addCity(cityName);
});

var displayCurrentDate = function(data) {
    //get the appropriate icon
    var icon = data.weather[0].icon;
    var iconPath = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
  //  var icon = document.createElement("span");
   // icon.setAttribute("img", iconPath);
    var name = document.createElement("p");
    name.setAttribute("class", "cityName");
    var date = moment().format("MM/DD/YYYY");
    name.innerHTML = data.name + " " + date + "<span><img src='" +iconPath + "'></img></span>";
    //name.innerHTML = data.name;
    cityInfo.appendChild(name);
    var temp = document.createElement("p");
    temp.setAttribute("class", "details");
    var degreeChar = "&#x2109;"
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
    var name = document.createElement("p");
    name.setAttribute("class", "cityList");
    name.textContent = cityName;
   var cityList = document.querySelector("#list");
   cityList.appendChild(name);
};

$("#btnClear").on("click", function(){
weather.removeChild(weather.childNodes[2]);

});

var getUVIndev = function(cityData) {
    var lat = cityData.coord.lat;
    var lon = cityData.coord.lon;
    var apiURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + lat + "&lon=" + lon;
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
                //display day + 1
               // getFirstDay(data);
               // getSecondDay(data);
               getFirstDay(data);
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
        var iconList = data.list[i].weather[0].icon;
        var iconPath = "http://openweathermap.org/img/wn/" + iconList + "@2x.png"
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
    //get the first, and display it
    var day = document.querySelector("#second-day");
    var datePlus = moment().add(2, "days");
    var date = document.createElement("p");
    date.setAttribute("class", "five-day top");
    date.textContent = datePlus.format("MM/DD/YYYY");
    day.appendChild(date);
    //get the icon
    var iconList = data.list[10].weather[0].icon;
    var iconPath = "http://openweathermap.org/img/wn/" + iconList + "@2x.png"
    var icon = document.createElement("img");
    icon.setAttribute("class", "five-day img");
    icon.setAttribute("src", iconPath);
    day.appendChild(icon);
    //list[5].main.temp
    //list[5].main.humidity
    //add temperature
    var temp = document.createElement("p");
    temp.setAttribute("class", "five-day");
    temp.textContent = "Temp: " + data.list[10].main.temp  + "\xB0"+ " F";
    day.appendChild(temp);
    //add humidity
    var humidity = document.createElement("p");
    humidity.setAttribute("class", "five-day");
    humidity.textContent = "Humidity: " + data.list[10].main.humidity;
    day.appendChild(humidity);
};

var getFirstInfo = function(data) {
    var day = document.querySelector("#first-day");
    var datePlus = moment().add(1, "days");
    var date = document.createElement("p");
    date.setAttribute("class", "five-day top");
    date.textContent = datePlus.format("MM/DD/YYYY");
    dateList = datePlus.format("YYYY-MM-DD");
    day.appendChild(date);
    for(var i = 0; i<data.list.length; i++) {
        //list[3].dt_txt
        var dtTime = data.list[i].dt_txt;
        if(dtTime === dateList + " 12:00:00") {
            console.log("FirstDate = ", dtTime);
            console.log("List = ", data.list[i]);
            console.log("number: ", i);
        }
    }

};