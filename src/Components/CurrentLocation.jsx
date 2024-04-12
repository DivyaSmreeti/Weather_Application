import { useEffect, useState } from "react";
import ReactAnimatedWeather from "react-animated-weather";
// import WeatherIcon from "react-animated-weather";

const datebuider = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();
  return `${day} , ${date} ${month} ${year}`;
};

const defaults = {
  // icon: 'CLEAR_DAY',
  color: "white",
  size: 80,
  animate: true,
};

const CurrentLocation = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [icon, setIcon] = useState("CLEAR_DAY");
  const [city, setCity] = useState("");
  const [searchedWeatherData, setSearchedWeatherData] = useState(null);
  const apiKey = "29e86639a6fb8af5e1c95deae7b96a64";
  const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

  useEffect(() => {
    const fetchData = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          console.log(response);

          if (!response.ok) {
            throw new Error("Weather data not available");
          }

          const data = await response.json();
          console.log(data);
          setWeatherData(data);
          switch (data.weather[0].main) {
            case "Haze":
              setIcon("CLEAR_DAY");
              break;
            case "Clouds":
              setIcon("CLOUDY");
              break;
            case "Rain":
              setIcon("RAIN");
              break;
            case "Snow":
              setIcon("SNOW");
              break;
            case "Dust":
              setIcon("WIND");
              break;
            case "Drizzle":
              setIcon("SLEET");
              break;
            case "Fog":
            case "Smoke":
              setIcon("FOG");
              break;
            case "Tornado":
              setIcon("WIND");
              break;
            default:
              setIcon("CLEAR_DAY");
          }
        });
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
      }
    };

    fetchData();
  }, [apiKey, baseUrl]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Weather data not available");
      }

      const data = await response.json();
      const { coord } = data;
      setSearchedWeatherData(data);

      if (coord) {
        // fetchData(coord.lat, coord.lon);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
  };

  useEffect(() => {
    // Update the current time every second
    const intervalID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalID);
  }, []); // Empty dependency array ensures that useEffect runs only once on mount

  const formattedTime = currentTime.toLocaleTimeString();

  // CODE TO UPDATE BG ACCORDING TO DAY AND NIGHT TIME

  const updateBackground = () => {
    const currentHour = currentTime.getHours();
    // console.log(currentHour);
    const isNightTime = currentHour >= 18 || currentHour < 6;
    const fullWrap = document.querySelector(".full-wrap");
    if (fullWrap) {
      if (isNightTime) {
        fullWrap.classList.remove("day-bg");
        fullWrap.classList.add("night-bg");
      } else {
        fullWrap.classList.remove("night-bg");
        fullWrap.classList.add("day-bg");
      }
    }
  };
  updateBackground();
  //   useEffect(() => {
  //     const intervalID = setInterval(updateBackground, 60 * 1000);

  // // Cleanup the interval on component unmount
  // return () => clearInterval(intervalID);
  //   })

  return (
    <>
      {weatherData ? (
        <div className="full-wrap">
          <div className="container wrap1">
            <div className="row row1">
              {/* FIRST COLUMN */}
              <div className="col-lg-6">
                <div className="loc-details">
                  <h1 className="">
                    {weatherData.name}, {weatherData.sys.country}
                  </h1>
                  <span className="">{datebuider(new Date())}</span>
                  <span className="">{formattedTime}</span>
                </div>

                <div className="weather-details">
                  <h1>{weatherData.main.temp}</h1>
                  <div className="column-data">
                    <span>°C</span>
                    <span>{weatherData.weather[0].description}</span>
                  </div>
                  <div className="weather-icon">
                    <ReactAnimatedWeather
                      icon={icon}
                      color={defaults.color}
                      size={defaults.size}
                      animate={defaults.animate}
                    />
                  </div>
                </div>
              </div>

              {/*SECOND COLUMN */}
              <div className="col-lg-6">
                <div className="search-container">
                  <input
                    className="search-box"
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <button className="search-btn" onClick={handleSearch}>
                    Search
                  </button>
                </div>
                {searchedWeatherData ? (
                  <div className="search-details">
                    <h2>
                      {searchedWeatherData.name},{" "}
                      {searchedWeatherData.sys.country}
                    </h2>
                    <span>Temperature: {searchedWeatherData.main.temp} °C</span>
                    <span>
                      Weather: {searchedWeatherData.weather[0].description}
                    </span>
                    {/* <WeatherIcon
                  icon={icon}
                  color={defaults.color}
                  size={defaults.size}
                  animate={defaults.animate}
                /> */}
                  </div>
                ) : (
                  <div className="py-3 px-1">
                    Enter Name of any City to display its current Weather.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader-bg">
          <div className="canvas canvas6">
            <div className="spinner6 p1"></div>
            <div className="spinner6 p2"></div>
            <div className="spinner6 p3"></div>
            <div className="spinner6 p4"></div>
          </div>
          <p className="loader-text">Loading Weather Data ...</p>
        </div>
      )}
    </>
  );
};

export default CurrentLocation;
