
// Format temperature for display
export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

// Format date for display
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

// Format time for display
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Get weather icon URL from icon code
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Group forecast data by day (for 5-day forecast)
export const groupForecastByDay = (forecastList: any[]): any[] => {
  const dailyData: { [key: string]: any } = {};

  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0];

    if (!dailyData[day]) {
      dailyData[day] = {
        dt: item.dt,
        date: day,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        weather: item.weather[0],
        wind: item.wind,
      };
    } else {
      // Update min/max temperatures
      if (item.main.temp_min < dailyData[day].temp_min) {
        dailyData[day].temp_min = item.main.temp_min;
      }
      if (item.main.temp_max > dailyData[day].temp_max) {
        dailyData[day].temp_max = item.main.temp_max;
      }
      // Use the weather from daytime (noon) preferably
      const itemHour = new Date(item.dt * 1000).getHours();
      if (itemHour >= 12 && itemHour <= 15) {
        dailyData[day].weather = item.weather[0];
      }
    }
  });

  return Object.values(dailyData);
};

// Get background gradient class based on weather and time
export const getWeatherBackgroundClass = (weatherCondition: string, icon: string): string => {
  // Check if it's night by looking at the icon (n suffix for night icons)
  const isNight = icon.includes('n');
  
  // Determine the weather condition
  if (weatherCondition.toLowerCase().includes('rain') || weatherCondition.toLowerCase().includes('drizzle')) {
    return 'weather-gradient-rain';
  } else if (weatherCondition.toLowerCase().includes('thunderstorm')) {
    return 'weather-gradient-storm';
  } else {
    return isNight ? 'weather-gradient-night' : 'weather-gradient-day';
  }
};
