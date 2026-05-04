/* --------------------------
   GLOBAL VARIABLES
-------------------------- */

let currentWeatherData = null;
let currentUnit = "C";

/* --------------------------
   FORMAT HELPERS
-------------------------- */

function formatDateWithDay(dateString) {
  const date = new Date(dateString + "T00:00:00");
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  return `${dayName}, ${dateString}`;
}

function formatHourTime(timeString) {
  const date = new Date(timeString.replace(" ", "T"));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true
  });
}

function formatHourDate(timeString) {
  const date = new Date(timeString.replace(" ", "T"));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

/* --------------------------
   SAVED LOCATIONS
-------------------------- */

function getSavedLocations() {
  return JSON.parse(localStorage.getItem("savedLocations")) || [];
}

function saveLocation(locationName) {
  let saved = getSavedLocations();

  saved = saved.filter(loc => loc.toLowerCase() !== locationName.toLowerCase());
  saved.unshift(locationName);

  if (saved.length > 5) saved = saved.slice(0, 5);

  localStorage.setItem("savedLocations", JSON.stringify(saved));
  updateSavedLocationsMenu();
}

function updateSavedLocationsMenu() {
  const select = document.getElementById("savedLocations");
  const saved = getSavedLocations();

  select.innerHTML = "";

  if (saved.length === 0) {
    select.innerHTML = `<option value="">No saved locations</option>`;
    return;
  }

  saved.forEach(loc => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    select.appendChild(option);
  });
}

/* --------------------------
   UNIT TOGGLE
-------------------------- */

function updateTemperatureDisplay() {
  if (!currentWeatherData) return;

  const data = currentWeatherData;

  if (currentUnit === "C") {
    document.getElementById("mainTemp").textContent = data.current.temp_c;
    document.getElementById("mainUnit").textContent = "°C";
    document.getElementById("otherTemp").textContent = `${data.current.temp_f}°F`;
  } else {
    document.getElementById("mainTemp").textContent = data.current.temp_f;
    document.getElementById("mainUnit").textContent = "°F";
    document.getElementById("otherTemp").textContent = `${data.current.temp_c}°C`;
  }

  updateFutureForecast(data);
  updateHourlyForecast(data);
}

function toggleUnit() {
  currentUnit = currentUnit === "C" ? "F" : "C";
  updateTemperatureDisplay();
}

/* --------------------------
   GPS LOCATION
-------------------------- */

function loadByGPS() {
  document.getElementById("lastUpdated").textContent = "Finding your location...";

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        getWeather(`${lat},${lon}`, false);
      },
      () => {
        getWeather("Pullman", false);
      }
    );
  } else {
    getWeather("Pullman", false);
  }
}

/* --------------------------
   GET WEATHER DATA
-------------------------- */

async function getWeather(location = "Pullman", shouldSave = true) {

  const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${encodeURIComponent(location)}&days=3`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "40a8e974bamsh7f0973adf5c7f3cp1b290ajsn4a8a001f3b4e",
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com"
    }
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    if (data.error) {
      document.getElementById("lastUpdated").textContent = "Location not found";
      return;
    }

    currentWeatherData = data;

    if (shouldSave) {
      saveLocation(data.location.name);
    }

    document.getElementById("locationName").textContent =
      `${data.location.name}, ${data.location.country}`;

    document.getElementById("lastUpdated").textContent =
      `Updated: ${data.location.localtime}`;

    document.getElementById("conditionText").textContent =
      data.current.condition.text;

    document.getElementById("conditionIcon").innerHTML =
      `<img src="https:${data.current.condition.icon}">`;

    document.getElementById("humidityValue").textContent =
      data.current.humidity;

    document.getElementById("humidityBar").style.width =
      `${data.current.humidity}%`;

    document.getElementById("windSpeed").textContent =
      data.current.wind_kph;

    document.getElementById("windDir").textContent =
      data.current.wind_dir;

    updateTemperatureDisplay();

  } catch (err) {
    console.error(err);
    document.getElementById("lastUpdated").textContent = "Error loading weather";
  }
}

/* --------------------------
   3-DAY FORECAST (NO SKIP)
-------------------------- */

function updateFutureForecast(data) {
  const days = data.forecast.forecastday;

  days.forEach((day, i) => {
    const num = i + 1;

    document.getElementById(`day${num}Name`).textContent =
      formatDateWithDay(day.date);

    document.getElementById(`day${num}Icon`).innerHTML =
      `<img src="https:${day.day.condition.icon}">`;

    document.getElementById(`day${num}Condition`).textContent =
      day.day.condition.text;

    if (currentUnit === "C") {
      document.getElementById(`day${num}Hi`).textContent =
        `${day.day.maxtemp_c}°C`;
      document.getElementById(`day${num}Lo`).textContent =
        `${day.day.mintemp_c}°C`;
    } else {
      document.getElementById(`day${num}Hi`).textContent =
        `${day.day.maxtemp_f}°F`;
      document.getElementById(`day${num}Lo`).textContent =
        `${day.day.mintemp_f}°F`;
    }

    document.getElementById(`day${num}Wind`).textContent =
      `Wind: ${day.day.maxwind_kph} kph`;
  });
}

/* --------------------------
   HOURLY FORECAST
-------------------------- */

function updateHourlyForecast(data) {
  const container = document.getElementById("hourlyContainer");
  container.innerHTML = "";

  const days = data.forecast.forecastday;

  days.forEach(day => {
    day.hour.forEach(hour => {

      const card = document.createElement("div");
      card.className = "hourCard";

      const temp =
        currentUnit === "C"
          ? `${hour.temp_c}°C`
          : `${hour.temp_f}°F`;

      card.innerHTML = `
        <p>${formatHourDate(hour.time)}</p>
        <p>${formatHourTime(hour.time)}</p>
        <img src="https:${hour.condition.icon}">
        <p>${temp}</p>
      `;

      container.appendChild(card);
    });
  });
}

/* --------------------------
   MODAL + EVENTS
-------------------------- */

const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const modalOverlay = document.getElementById("modalOverlay");
const locationModal = document.getElementById("locationModal");
const locationForm = document.getElementById("locationForm");
const locationInput = document.getElementById("locationInput");

const unitToggle = document.getElementById("unitToggle");
const useSaved = document.getElementById("useSaved");
const resetLocation = document.getElementById("resetLocation");
const savedLocations = document.getElementById("savedLocations");

function showModal() {
  modalOverlay.classList.remove("hidden");
  locationModal.classList.remove("hidden");
}

function hideModal() {
  modalOverlay.classList.add("hidden");
  locationModal.classList.add("hidden");
}

openModalBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", hideModal);
modalOverlay.addEventListener("click", hideModal);

unitToggle.addEventListener("click", toggleUnit);

locationForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const newLocation = locationInput.value.trim();

  if (newLocation !== "") {
    getWeather(newLocation, true);
    hideModal();
    locationForm.reset();
  }
});

useSaved.addEventListener("click", () => {
  if (savedLocations.value) {
    getWeather(savedLocations.value, true);
    hideModal();
  }
});

resetLocation.addEventListener("click", () => {
  loadByGPS();
  hideModal();
});

/* --------------------------
   INITIAL LOAD
-------------------------- */

updateSavedLocationsMenu();
getWeather("Pullman", false);