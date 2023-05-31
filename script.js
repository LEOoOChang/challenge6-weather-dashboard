// Define variables
const apiKey = "433d62b1113630ffb0057c2ce01347d7";
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchHistoryContainer = document.getElementById("search-history");
const searchHistoryList = document.getElementById("search-history-list");
const currentWeatherContainer = document.getElementById("current-weather");
const forecastContainer = document.getElementById("forecast");
let searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Define functions
async function getCity(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  if (data.cod === 200) {
    // Display current weather data
    const cityName = data.name;
    const currentDate = new Date().toLocaleDateString();
    const weatherIcon = data.weather[0].icon;
    const weatherDescription = data.weather[0].description;
    const temperature = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    currentWeatherContainer.innerHTML = `
      <h2>${cityName}</h2>
      <p>${currentDate}</p>
      <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDescription}">
      <p>${temperature}°C</p>
      <p>${humidity}% humidity</p>
      <p>${windSpeed} m/s</p>
    `;

    // Display forecast data
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastResponse.json();
    const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
    const forecastHtml = forecastList.map(item => {
      const forecastDate = new Date(item.dt_txt).toLocaleDateString();
      const forecastIcon = item.weather[0].icon;
      const forecastDescription = item.weather[0].description;
      const forecastTemperature = Math.round(item.main.temp);
      const forecastHumidity = item.main.humidity;
      return `
        <div class="forecast-item">
          <p>${forecastDate}</p>
          <img src="https://openweathermap.org/img/wn/${forecastIcon}.png" alt="${forecastDescription}">
          <p>${forecastTemperature}°C</p>
          <p>${forecastHumidity}% humidity</p>
        </div>
      `;
    }).join('');
    forecastContainer.innerHTML = forecastHtml;

    // Add city to search history
    const searchItem = document.createElement("li");
    searchItem.innerHTML = cityName;
    searchHistoryList.appendChild(searchItem);
    searchHistoryArray.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));
  } else {
    alert("City not found. Please try again.");
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const city = cityInput.value;
  getCity(city);
  cityInput.value = "";
}

function handleSearchHistoryClick(event) {
  const city = event.target.textContent;
  getCity(city);
}

// Add event listeners
searchForm.addEventListener("submit", handleSubmit);
searchHistoryList.addEventListener("click", handleSearchHistoryClick);

// Display search history
searchHistoryArray.forEach(city => {
  const searchItem = document.createElement("li");
  searchItem.innerHTML = city;
  searchHistoryList.appendChild(searchItem);
});