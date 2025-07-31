document.addEventListener('DOMContentLoaded', () => {
    /* figure out how to hide API key */
    const API_KEY = 'bb98a01cb1692649b757954e7dd7ab3e';

    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const weatherDisplay = document.getElementById('weather-display');
    
    const fetchWeather = async (city) => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`It looks like the city you're looking for doesn't exist or has advanced cloaking technologies. Atmos will try again later. (${response.status})`);
            }
            const data = await response.json();            
            
            localStorage.setItem('lastCity', city);
            
            if (document.body.querySelector('.weather-today')) {
                updateCurrentWeather(data);
            } else if (document.body.querySelector('.weather-forecast')) {
                update5DayForecast(data);
            }
        } catch (error) {
            weatherDisplay.innerHTML = `<div class="placeholder"><p>⚠️ ${error.message}. Atmos is under maintence right now, try again later.</p></div>`;
        }
    };
    
    const updateCurrentWeather = (data) => {
        const today = data.list[0];
        const cityName = data.city.name;
        const weatherIcon = getWeatherIcon(today.weather[0].id);
        /* Heavily referenced documents prof sent and Openweather */
        weatherDisplay.innerHTML = `
            <h2>${cityName}</h2>
            <div class="today-main">
                <img src="images/${weatherIcon}" alt="${today.weather[0].description}">
                <div class="today-temp">${Math.round(today.main.temp)}<sup>°F</sup></div>
            </div>
            <p>${today.weather[0].main}</p>
            <div class="today-details">
                <p><strong>Feels Like:</strong> ${Math.round(today.main.feels_like)}°F</p>
                <p><strong>Humidity:</strong> ${today.main.humidity}%</p>
                <p><strong>Wind:</strong> ${Math.round(today.wind.speed)} mph</p>
                <p><strong>Pressure:</strong> ${today.main.pressure} hPa</p>
            </div>
        `;
    };
    
    const update5DayForecast = (data) => {
        const cityName = data.city.name;
        
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        let forecastHTML = `<h2>${cityName}'s 5 Day Outlook</h2><div class="forecast-grid">`;
        dailyForecasts.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const weatherIcon = getWeatherIcon(day.weather[0].id);

            forecastHTML += `
                <div class="forecast-card">
                    <h3>${dayName}</h3>
                    <img src="images/${weatherIcon}" alt="${day.weather[0].description}">
                    <p>${Math.round(day.main.temp)}<sup>°F</sup></p>
                    <small>${day.weather[0].main}</small>
                    <small>${getAtmosMood(day.weather[0].main)}</small>
                </div>
            `;
        });
        forecastHTML += `</div>`;
        weatherDisplay.innerHTML = forecastHTML;
    };    

    const getAtmosMood = (condition) => {
    switch(condition) {
        case "Rain": return "☔ Deploying Umbrella Protocol";
        case "Clear": return "☀️ Exposing Solar Panels";
        case "Clouds": return "🌥️ Suspiciously overcast";
        case "Snow": return "❄️ Prepare thermal shielding";
        case "Thunderstorm": return "⚡ Alert: Atmospheric Instability";
        default: return "🔎 Monitoring...";
    }
};
    
    const getWeatherIcon = (weatherId) => {
        if (weatherId >= 200 && weatherId < 300) return 'storm.png';
        if (weatherId >= 300 && weatherId < 600) return 'rain.png';
        if (weatherId >= 600 && weatherId < 700) return 'snow.png';
        if (weatherId >= 700 && weatherId < 800) return 'atmosphere.png';
        if (weatherId === 800) return 'clear.png';
        if (weatherId > 800) return 'clouds.png';
        return 'clouds.png'; 
    };
    
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    });

    // --- EXTRA CRDEIT ---
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        fetchWeather(lastCity);
    }
});