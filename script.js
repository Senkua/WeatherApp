const API_KEY = '1904a21f6572a52a0bb24464d5c491f4';
const cityForm = document.getElementById('cityForm');
const cityInput = document.getElementById('cityInput');
const currentWeather = document.getElementById('currentWeather');
const forecastContainer = document.getElementById('forecastContainer');
const searchHistory = document.getElementById('searchHistory');
let cities = [];

// Fetch weather data from API
async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

// Fetch forecast data from API
async function getForecastData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

// Display current weather
function displayCurrentWeather(data) {
  currentWeather.innerHTML = `
    <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
    <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
    <p>Temperature: ${data.main.temp} °C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

// Display forecast
function displayForecast(data) {
  forecastContainer.innerHTML = '';
  for (let i = 0; i < data.list.length; i += 8) {
    const forecastData = data.list[i];
    const forecastDate = new Date(forecastData.dt_txt).toLocaleDateString();
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    forecastItem.innerHTML = `
      <p>Date: ${forecastDate}</p>
      <img src="http://openweathermap.org/img/w/${forecastData.weather[0].icon}.png" alt="${forecastData.weather[0].description}">
      <p>Temperature: ${forecastData.main.temp} °C</p>
      <p>Humidity: ${forecastData.main.humidity}%</p>
      <p>Wind Speed: ${forecastData.wind.speed} m/s</p>
    `;
    forecastContainer.appendChild(forecastItem);
  }
}

// Display search history
function displaySearchHistory() {
  searchHistory.innerHTML = '';
  for (let i = 0; i < cities.length; i++) {
    searchHistory.innerHTML += `<li>${cities[i]}</li>`;
  }
}

// Handle form submission
cityForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    const weatherData = await getWeatherData(city);
    const forecastData = await getForecastData(city);
    displayCurrentWeather(weatherData);
    displayForecast(forecastData);
    cities.push(city);
    displaySearchHistory();
    cityInput.value = '';
  }
});

// Handle click on search history item
searchHistory.addEventListener('click', async function(event) {
  const li = event.target.closest('li');
  if (li) {
    const city = li.textContent;
    const weatherData = await getWeatherData(city);
    const forecastData = await getForecastData(city);
    displayCurrentWeather(weatherData);
    displayForecast(forecastData);
  }
});