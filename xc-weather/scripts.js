let currentWeatherData = null;
let currentUnit = "C";

/* --------------------------
   GET WEATHER
-------------------------- */

async function getWeather(location = "Pullman", save = true) {

  const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=3`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "40a8e974bamsh7f0973adf5c7f3cp1b290ajsn4a8a001f3b4e",
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com"
    }
  };

  const res = await fetch(url, options);
  const data = await res.json();

  currentWeatherData = data;

  if (save) saveLocation(data.location.name);

  document.getElementById("locationName").textContent =
    data.location.name;

  document.getElementById("lastUpdated").textContent =
    data.location.localtime;

  updateDisplay();
}

/* --------------------------
   DISPLAY
-------------------------- */

function updateDisplay() {
  const d = currentWeatherData;

  if (currentUnit === "C") {
    mainTemp.textContent = d.current.temp_c + "°C";
    otherTemp.textContent = d.current.temp_f + "°F";
  } else {
    mainTemp.textContent = d.current.temp_f + "°F";
    otherTemp.textContent = d.current.temp_c + "°C";
  }

  conditionText.textContent = d.current.condition.text;
  conditionIcon.innerHTML = `<img src="https:${d.current.condition.icon}">`;

  humidityValue.textContent = d.current.humidity;
  windSpeed.textContent = d.current.wind_kph;
  windDir.textContent = d.current.wind_dir;

  /* 3 DAY */
  d.forecast.forecastday.forEach((day, i) => {
    const num = i + 1;

    document.getElementById(`day${num}Name`).textContent = day.date;
    document.getElementById(`day${num}Condition`).textContent = day.day.condition.text;
    document.getElementById(`day${num}Hi`).textContent =
      currentUnit === "C" ? day.day.maxtemp_c : day.day.maxtemp_f;
    document.getElementById(`day${num}Lo`).textContent =
      currentUnit === "C" ? day.day.mintemp_c : day.day.mintemp_f;
  });

  /* HOURLY */
  hourlyContainer.innerHTML = "";

  d.forecast.forecastday.forEach(day => {
    day.hour.forEach(hour => {
      const card = document.createElement("div");
      card.className = "hourCard";

      card.innerHTML = `
        <p>${hour.time.split(" ")[1]}</p>
        <p>${currentUnit === "C" ? hour.temp_c : hour.temp_f}°</p>
      `;

      hourlyContainer.appendChild(card);
    });
  });
}

/* --------------------------
   UNIT TOGGLE
-------------------------- */

unitToggle.onclick = () => {
  currentUnit = currentUnit === "C" ? "F" : "C";
  updateDisplay();
};

/* --------------------------
   SAVED LOCATIONS
-------------------------- */

function saveLocation(loc) {
  let list = JSON.parse(localStorage.getItem("locs")) || [];

  list = list.filter(l => l !== loc);
  list.unshift(loc);

  if (list.length > 5) list.pop();

  localStorage.setItem("locs", JSON.stringify(list));
  updateSaved();
}

function updateSaved() {
  const list = JSON.parse(localStorage.getItem("locs")) || [];

  savedLocations.innerHTML = "";

  list.forEach(loc => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    savedLocations.appendChild(option);
  });
}

useSaved.onclick = () => getWeather(savedLocations.value);
resetLocation.onclick = loadByGPS;

/* --------------------------
   GPS
-------------------------- */

function loadByGPS() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      getWeather(`${pos.coords.latitude},${pos.coords.longitude}`, false);
    },
    () => {
      getWeather("Pullman", false);
    }
  );
}

/* --------------------------
   MODAL
-------------------------- */

openModal.onclick = () => locationModal.classList.remove("hidden");
closeModal.onclick = () => locationModal.classList.add("hidden");

locationForm.onsubmit = (e) => {
  e.preventDefault();
  getWeather(locationInput.value);
  locationModal.classList.add("hidden");
};

/* --------------------------
   START
-------------------------- */

updateSaved();
getWeather("Pullman");