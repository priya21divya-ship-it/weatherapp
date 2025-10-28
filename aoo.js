
    const API_KEY = "6cc8c2fd4186f9d05a6f60280a1b129f"; // Get a free key from openweathermap.org
    

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) fetchWeather(city);
});

async function fetchWeather(city) {
  showLoader(true);
  try {
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoRes.json();
    if (!geoData.length) { alert("City not found"); showLoader(false); return; }

    const { lat, lon, name, country } = geoData[0];
    document.getElementById("location").textContent = `${name}, ${country}`;

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherRes.json();

    renderCurrent(weatherData.list[0]);
    renderWeather(weatherData.list);
    updateWeatherAnimation(weatherData.list[0].weather[0].main);

  } catch (err) {
    console.error(err);
    alert("Error fetching data");
  }
  showLoader(false);
}

function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

function renderCurrent(data) {
  const currentDiv = document.getElementById("currentWeather");
  currentDiv.innerHTML = `
    <div class="current-weather-card">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
      <h3>${Math.round(data.main.temp)}°C - ${data.weather[0].description}</h3>
      <p>Feels like: ${Math.round(data.main.feels_like)}°C<br>
         Humidity: ${data.main.humidity}%<br>
         Wind: ${data.wind.speed} m/s</p>
    </div>
  `;
}

function renderWeather(data) {
  const grid = document.getElementById("weatherGrid");
  grid.innerHTML = "";
  const daily = data.filter((item, index) => index % 8 === 0).slice(0, 6);
  daily.forEach(item => {
    const card = document.createElement("div");
    card.className = "weather-card";
    const date = new Date(item.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    card.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" />
      <h3>${dayName}</h3>
      <p>${Math.round(item.main.temp)}°C<br>${item.weather[0].description}</p>
    `;
    grid.appendChild(card);
  });
}

// Update weather background animations
function updateWeatherAnimation(weatherMain) {
  const sun = document.querySelector('.sun');
  const clouds = document.querySelectorAll('.cloud');
  const rain = document.querySelector('.rain');

  sun.style.display = 'none';
  clouds.forEach(c => c.style.display = 'none');
  rain.style.display = 'none';

  weatherMain = weatherMain.toLowerCase();
  if (weatherMain.includes("clear")) sun.style.display = "block";
  else if (weatherMain.includes("clouds")) clouds.forEach(c => c.style.display = "block");
  else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) rain.style.display = "block";
}
