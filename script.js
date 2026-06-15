// script.js - weather-app
const API_KEY = "93420e06608a2643c6f1e95e0557fb58";

const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const wind = document.getElementById("wind");

const errorMessage = document.getElementById("errorMessage");
const loadingIndicator = document.querySelector(".loadingIndicator");

const weatherContent = document.querySelector(".weather-content");
const searchBtn = document.getElementById("searchBtn");


weatherForm.addEventListener("submit", getWeather);

function getWeatherEmoji(iconCode) {
    const emojiMap = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌧️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return emojiMap[iconCode] || '🌡️';
}

async function getWeather(event) {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (city === '') {
        showError("Please enter a city");
        return;
    }
    loadingIndicator.style.display = "block";
    hideError();

    try {
        searchBtn.disabled = true;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found");
        }
        weatherContent.style.display = "block";
        const data = await response.json();

        const cityValue = data.name;
        const tempValue = data.main.temp;
        const humidityValue = data.main.humidity;
        const feelsLikeValue = data.main.feels_like;
        const windValue = data.wind.speed;
        const descriptionValue = data.weather[0].description;
        const iconValue = data.weather[0].icon;

        cityName.textContent = cityValue;
        temperature.textContent = `${Math.round(tempValue)}°C`;
        humidity.textContent = `${humidityValue}%`;
        feelsLike.textContent = `${Math.round(feelsLikeValue)}°C`;
        wind.textContent = `${windValue} m/s`;

        const weatherEmoji = getWeatherEmoji(iconValue);
        description.textContent = `${weatherEmoji} ${capitalizeWords(descriptionValue)}`;
    }
    catch (error) {
        showError(error.message);
    }
    finally {
        loadingIndicator.style.display = "none";
        searchBtn.disabled = false;
    }

}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function hideError() {
    errorMessage.style.display = "none";
}

function capitalizeWords(text) {
    return text.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

