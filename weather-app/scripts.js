/* --------------------------
   GLOBAL VARIABLES
-------------------------- */

let currentWeatherData = null;
let currentUnit = "C";

/* --------------------------
   HELPER: FORMAT DATE
-------------------------- */

function formatDateWithDay(dateString) {
  const date = new Date(dateString + "T00:00:00");

  const dayName = date.toLocaleDateString("en-US", {
    weekday: "short"
  });

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

  saved = saved.filter(function (location) {
    return location.toLowerCase() !== locationName.toLowerCase();
  });

  saved.unshift(locationName);

  if (saved.length > 5) {
    saved = saved.slice(0, 5);
  }

  localStorage.setItem("savedLocations", JSON.stringify(saved));
  updateSavedLocationsMenu();
}

function updateSavedLocationsMenu() {
  const savedLocations = document.getElementById("savedLocations");
  const saved = getSavedLocations();

  savedLocations.innerHTML = "";

  if (saved.length === 0) {
    savedLocations.innerHTML = `<option value="">No saved locations yet</option>`;
    return;
  }

  saved.forEach(function (location) {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    savedLocations.appendChild(option);
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
  if (currentUnit === "C") {
    currentUnit = "F";
  } else {
    currentUnit = "C";
  }

  updateTemperatureDisplay();
}

/* --------------------------
   GPS LOCATION
-------------------------- */

function loadByGPS() {
  document.getElementById("lastUpdated").textContent = "Finding your location...";

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        getWeather(`${lat},${lon}`, false);
      },
      function () {
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
  const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${encodeURIComponent(location)}&days=4`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "PASTE_YOUR_KEY_HERE",
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com"
    }
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    if (data.error) {
      document.getElementById("lastUpdated").textContent =
        "Location not found. Please try again.";
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
      `<img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">`;

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

    document.getElementById("lastUpdated").textContent =
      "Error loading weather.";
  }
}

/* --------------------------
   NEXT 3 DAYS FORECAST
-------------------------- */

function updateFutureForecast(data) {
  const futureDays = data.forecast.forecastday.slice(1, 4);

  futureDays.forEach(function (day, index) {
    const number = index + 1;

    document.getElementById(`day${number}Name`).textContent =
      formatDateWithDay(day.date);

    document.getElementById(`day${number}Icon`).innerHTML =
      `<img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">`;

    document.getElementById(`day${number}Condition`).textContent =
      day.day.condition.text;

    if (currentUnit === "C") {
      document.getElementById(`day${number}Hi`).textContent =
        `${day.day.maxtemp_c}°C`;

      document.getElementById(`day${number}Lo`).textContent =
        `${day.day.mintemp_c}°C`;
    } else {
      document.getElementById(`day${number}Hi`).textContent =
        `${day.day.maxtemp_f}°F`;

      document.getElementById(`day${number}Lo`).textContent =
        `${day.day.mintemp_f}°F`;
    }

    document.getElementById(`day${number}Wind`).textContent =
      `Wind: ${day.day.maxwind_kph} kph`;
  });
}

/* --------------------------
   HOURLY FORECAST
-------------------------- */

function updateHourlyForecast(data) {
  const hourlyContainer = document.getElementById("hourlyContainer");
  hourlyContainer.innerHTML = "";

  const threeDays = data.forecast.forecastday.slice(1, 4);

  threeDays.forEach(function (day) {
    day.hour.forEach(function (hour) {
      const hourCard = document.createElement("div");
      hourCard.classList.add("hourCard");

      let tempText;

      if (currentUnit === "C") {
        tempText = `${hour.temp_c}°C`;
      } else {
        tempText = `${hour.temp_f}°F`;
      }

      hourCard.innerHTML = `
        <p class="hourDate">${formatHourDate(hour.time)}</p>
        <p class="hourTime">${formatHourTime(hour.time)}</p>
        <img src="https:${hour.condition.icon}" alt="${hour.condition.text}">
        <p class="hourTemp">${tempText}</p>
        <p class="hourCondition">${hour.condition.text}</p>
      `;

      hourlyContainer.appendChild(hourCard);
    });
  });
}

/* --------------------------
   MODAL ELEMENTS
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

/* --------------------------
   MODAL FUNCTIONS
-------------------------- */

function showModal() {
  modalOverlay.classList.remove("hidden");
  locationModal.classList.remove("hidden");
}

function hideModal() {
  modalOverlay.classList.add("hidden");
  locationModal.classList.add("hidden");
}

/* --------------------------
   EVENTS
-------------------------- */

openModalBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", hideModal);
modalOverlay.addEventListener("click", hideModal);

unitToggle.addEventListener("click", toggleUnit);

locationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newLocation = locationInput.value.trim();

  if (newLocation !== "") {
    getWeather(newLocation, true);
    hideModal();
    locationForm.reset();
  }
});

useSaved.addEventListener("click", function () {
  const selectedLocation = savedLocations.value;

  if (selectedLocation !== "") {
    getWeather(selectedLocation, true);
    hideModal();
  }
});

resetLocation.addEventListener("click", function () {
  loadByGPS();
  hideModal();
});

/* --------------------------
   INITIAL LOAD
-------------------------- */

updateSavedLocationsMenu();
loadByGPS();