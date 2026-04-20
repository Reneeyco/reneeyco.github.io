/* --------------------------
   HELPER: FORMAT DATE
-------------------------- */
function formatDateWithDay(dateString) {
  const date = new Date(dateString);
  const dayName = date.toLocaleDateString("en-US", {
    weekday: "short"
  });

  return `${dayName}, ${dateString}`;
}

/* --------------------------
   GET WEATHER DATA
-------------------------- */
async function getWeather(location = "Pullman") {
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

    console.log(data);

    /* CURRENT WEATHER */
    document.getElementById("locationName").textContent =
      `${data.location.name}, ${data.location.country}`;

    document.getElementById("lastUpdated").textContent =
      `Updated: ${data.location.localtime}`;

    document.getElementById("tempC").textContent = data.current.temp_c;
    document.getElementById("tempF").textContent = `${data.current.temp_f}°F`;

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

    /* FORECAST */
    const f = data.forecast.forecastday;

    document.getElementById("day1Name").textContent =
      formatDateWithDay(f[0].date);
    document.getElementById("day1Icon").innerHTML =
      `<img src="https:${f[0].day.condition.icon}" alt="${f[0].day.condition.text}">`;
    document.getElementById("day1Condition").textContent =
      f[0].day.condition.text;
    document.getElementById("day1HiC").textContent =
      `${f[0].day.maxtemp_c}°C`;
    document.getElementById("day1LoC").textContent =
      `${f[0].day.mintemp_c}°C`;
    document.getElementById("day1Wind").textContent =
      `Wind: ${f[0].day.maxwind_kph} kph`;

    document.getElementById("day2Name").textContent =
      formatDateWithDay(f[1].date);
    document.getElementById("day2Icon").innerHTML =
      `<img src="https:${f[1].day.condition.icon}" alt="${f[1].day.condition.text}">`;
    document.getElementById("day2Condition").textContent =
      f[1].day.condition.text;
    document.getElementById("day2HiC").textContent =
      `${f[1].day.maxtemp_c}°C`;
    document.getElementById("day2LoC").textContent =
      `${f[1].day.mintemp_c}°C`;
    document.getElementById("day2Wind").textContent =
      `Wind: ${f[1].day.maxwind_kph} kph`;

    document.getElementById("day3Name").textContent =
      formatDateWithDay(f[2].date);
    document.getElementById("day3Icon").innerHTML =
      `<img src="https:${f[2].day.condition.icon}" alt="${f[2].day.condition.text}">`;
    document.getElementById("day3Condition").textContent =
      f[2].day.condition.text;
    document.getElementById("day3HiC").textContent =
      `${f[2].day.maxtemp_c}°C`;
    document.getElementById("day3LoC").textContent =
      `${f[2].day.mintemp_c}°C`;
    document.getElementById("day3Wind").textContent =
      `Wind: ${f[2].day.maxwind_kph} kph`;

  } catch (err) {
    console.error(err);
    document.getElementById("lastUpdated").textContent =
      "Error loading weather";
  }
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
   MODAL EVENTS
-------------------------- */
openModalBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", hideModal);
modalOverlay.addEventListener("click", hideModal);

locationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newLocation = locationInput.value.trim();

  if (newLocation !== "") {
    getWeather(newLocation);
    hideModal();
    locationForm.reset();
  }
});

/* --------------------------
   INITIAL LOAD
-------------------------- */
getWeather();