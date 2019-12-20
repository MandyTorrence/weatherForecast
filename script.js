var cityName = "Raleigh";
//Creating the current date
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

today = '(' + mm + '/' + dd + '/' + yyyy + ')';
document.write(today);
// Initial array of cities

displayCityWeatherInfo();
var cityNames = ["Austin", "Chicago", "New York", "Orlando", "San Francisco", "Seattle", "Denver", "Atlanta"];
// displayCityWeatherInfo function re-renders the HTML to display the appropriate content


console.log(cityName)

function displayCityWeatherInfo() {
    cityName = $(this).attr("data-name") || cityName;
    var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=d27e4ef8262b4dc0c0a24082fb8435f3";

    // Creating an AJAX call for the specific city button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //Creating the icons and weather information for the current day
        var iconcode = response.weather[0].icon;
        var iconURL = "https://cors-anywhere.herokuapp.com/http://openweathermap.org/img/w/" + iconcode + ".png";

        $('#wicon').attr('src', iconURL);
        $("#city-name").text(response.name + " " + today + " ");
        $('#temperature-results').text((((response.main.temp - 273.15) * (9 / 5)) + 32).toFixed(2) + " °F");
        $('#humidity-results').text(response.main.humidity + "%");
        $('#wind-speed-results').text(response.wind.speed + " MPH");

        //Adding the second ajax call to bring in the UV Information
        function displayUVInfo() {
            var uvURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi?appid=d27e4ef8262b4dc0c0a24082fb8435f3&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
            console.log(uvURL)

            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (response) {
                $('#uv-index-results').text(response.value);
            });
        };
        displayUVInfo();

        //adding the five-day forecast ajax call

        function displayForecast() {
            var forecastURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=d27e4ef8262b4dc0c0a24082fb8435f3";
            console.log(forecastURL)

            function clear() {
                $("#forecat-results").empty();
            }
            clear();


            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (data) {
                for (var i = 0; i < 40; i++) {
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        $('#forecat-results').append(function dailyForecast() {

                            console.log(data.list[i].weather[0].icon)
                            console.log(data.list[i].dt_txt)
                            var dayIconCode = data.list[i].weather[0].icon;
                            var dayIconURL = "http://openweathermap.org/img/w/" + dayIconCode + ".png";
                            var dt = new Date(data.list[i].dt_txt);
                            console.log(dt)
                            return $("<div/>")
                                .attr("id", "forecastedDay")
                                .append($("<p/>").attr("class", "forecastDate").text(data.list[i].dt_txt[5] + data.list[i].dt_txt[6] + "/" + data.list[i].dt_txt[8] + data.list[i].dt_txt[9] + "/" + data.list[i].dt_txt[0] + data.list[i].dt_txt[1] + data.list[i].dt_txt[2] + data.list[i].dt_txt[3]))
                                .append($("<img/>").attr("src", dayIconURL))
                                .append($("<p/>").text("Temp: " + (((data.list[i].main.temp - 273.15) * (9 / 5)) + 32).toFixed(2) + " °F"))
                                .append($("<p/>").text("Humidity: " + data.list[i].main.humidity + "%"))
                        });
                    }
                }
            });
        };
        displayForecast();

    });
};

function renderButtons() {
    $("#search-buttons").empty();

    for (var i = 0; i < cityNames.length; i++) {
        var a = $("<button>");
        a.addClass("city-btn");
        a.attr("data-name", cityNames[i]);
        a.text(cityNames[i]);
        $("#search-buttons").append(a);
    }
}
$("#city-add").on("click", function (event) {
    event.preventDefault();
    var cityName = $("#city-input").val().trim();
    cityNames.push(cityName);
    renderButtons();
});
$(document).on("click", ".city-btn", displayCityWeatherInfo);

renderButtons();