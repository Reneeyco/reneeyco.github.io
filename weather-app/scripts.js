async function getWeather(location = "Pullman") {

  const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=3`;

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

    document.getElementById("locationName").textContent =
      `${data.location.name}, ${data.location.country}`;

    document.getElementById("lastUpdated").textContent =
      data.location.localtime;

    document.getElementById("tempC").textContent = data.current.temp_c;
    document.getElementById("tempF").textContent = data.current.temp_f;

    document.getElementById("conditionText").textContent =
      data.current.condition.text;

    document.getElementById("conditionIcon").innerHTML =
      `<img src="https:${data.current.condition.icon}">`;

    document.getElementById("humidityValue").textContent =
      data.current.humidity;

    document.getElementById("humidityBar").style.width =
      data.current.humidity + "%";

    document.getElementById("windSpeed").textContent =
      data.current.wind_kph;

    document.getElementById("windDir").textContent =
      data.current.wind_dir;

    const f = data.forecast.forecastday;

    for (let i = 0; i < 3; i++) {
      document.getElementById(`day${i + 1}Name`).textContent = f[i].date;
      document.getElementById(`day${i + 1}Condition`).textContent = f[i].day.condition.text;
      document.getElementById(`day${i + 1}HiC`).textContent = f[i].day.maxtemp_c;
      document.getElementById(`day${i + 1}LoC`).textContent = f[i].day.mintemp_c;
      document.getElementById(`day${i + 1}Wind`).textContent = f[i].day.maxwind_kph;
    }

  } catch (err) {
    console.log(err);
  }
}

getWeather();