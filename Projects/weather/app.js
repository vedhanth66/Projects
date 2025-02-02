const base_url = "https://api.openweathermap.org/data/2.5/weather?";
const search_btn = document.querySelector(".search_icon");
let temp = document.querySelector(".temp");
let city = document.querySelector(".city");
let extra = document.querySelector(".extra");
let image = document.querySelector(".image");
let cont = document.querySelector(".container");

search_btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let loc = document.querySelector(".input");
    const url = `${base_url}q=${loc.value}&appid=b7714c842035c7181baba44b9b97bea4`;
    console.log(url);
    
    let response = await fetch(url);
    let data = await response.json();
    
    if (data.cod === "404") {
        alert("City not found! Please try again.");
        return;
    }

    let tempval = data.main.temp - 273.15;
    let feel = data.main.feels_like - 273.15;
    let min = data.main.temp_min - 273.15;
    let max = data.main.temp_max - 273.15;
    let humidity = data.main.humidity;

    temp.innerText = `${tempval.toFixed(2)}°C`;
    city.innerText = loc.value.toUpperCase();
    extra.innerHTML = `Feels like: ${feel.toFixed(2)}°C<br>
            Temp min: ${min.toFixed(2)}°C<br>
            Temp max: ${max.toFixed(2)}°C<br>
            Humidity: ${humidity}%`;

    let currentTime = data.dt;
    let sunriseTime = data.sys.sunrise;
    let sunsetTime = data.sys.sunset;

    if (currentTime >= sunriseTime && currentTime <= sunsetTime) {
        cont.style.backgroundImage = "linear-gradient(to bottom right, #0061ff, #60efff)";
        temp.style.color = "white";
        city.style.color = "white";
        extra.style.color = "black";
        if (data.weather[0].main === "Rain" || data.weather[0].main === "Drizzle" || data.weather[0].main === "Thunderstorm" || data.weather[0].main === "Mist") {
            image.style.backgroundImage = "url('rain.png')";
        } else if (data.weather[0].main === "Clear") {
            image.style.backgroundImage = "url('sun.png')";
        } else {
            image.style.backgroundImage = "url('cloud.png')";
        }
    } else {
        cont.style.backgroundImage = "linear-gradient(to bottom right, #392d69, #b57bee)"; 
        temp.style.color = "white";
        city.style.color = "white";
        extra.style.color = "black";
        if (data.weather[0].main === "Rain" || data.weather[0].main === "Drizzle" || data.weather[0].main === "Thunderstorm" || data.weather[0].main === "Mist") {
            image.style.backgroundImage = "url('rain.png')";
        } else if (data.weather[0].main === "Clear") {
            image.style.backgroundImage = "url('moon.png')";
        } else {
            image.style.backgroundImage = "url('cloud.png')";
        }
    }
});
