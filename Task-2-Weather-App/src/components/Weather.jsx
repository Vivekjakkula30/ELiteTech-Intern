import { useState } from "react";
import axios from "axios";
import "./Weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:5000/weather/${city}`
      );

      setWeather(response.data);
      setCity("");
      setLoading(false);
    } catch (err) {
      setError("City not found!");
      setLoading(false);
    }
  };

  return (
    <div className={`app ${theme}`}>
      {/* Navbar */}
      <nav className="navbar">
        <h2>🌦 Weather App</h2>

        <div className="theme-toggle">
          <span
            className={theme === "light" ? "active" : ""}
            onClick={() => setTheme("light")}
          >
            ☀
          </span>

          <span
            className={theme === "dark" ? "active" : ""}
            onClick={() => setTheme("dark")}
          >
            🌙
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Check the Weather</h1>
        <p>Get real-time weather updates for any city in the world</p>

        {/* Search Box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
          />

          <button onClick={getWeather}>Search</button>
        </div>

        {/* Loading */}
        {loading && <p className="loading">Loading...</p>}

        {/* Error */}
        {error && <p className="error">{error}</p>}

        {/* Weather Card */}
        {weather && (
          <div className="weather-card">
            <div className="weather-top">
              <div className="location-box">
                <h2>
                  {weather.name}, {weather.sys.country}
                </h2>
                <p>Updated just now</p>
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />

              <div className="temp-box">
                <h1>{Math.round(weather.main.temp)}°C</h1>
                <p className="desc">{weather.weather[0].description}</p>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="weather-info">
              <div>
                <p>🌡 Feels Like</p>
                <h3>{Math.round(weather.main.feels_like)}°C</h3>
              </div>

              <div>
                <p>💧 Humidity</p>
                <h3>{weather.main.humidity}%</h3>
              </div>

              <div>
                <p>🌬 Wind Speed</p>
                <h3>{weather.wind.speed} m/s</h3>
              </div>

              <div>
                <p>👁 Visibility</p>
                <h3>{weather.visibility / 1000} km</h3>
              </div>

              <div>
                <p>⚡ Pressure</p>
                <h3>{weather.main.pressure} hPa</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;