
// Types for Open-Meteo API responses
export interface WeatherData {
  name: string; // We'll set this manually based on geocoding
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
  visibility: number;
}

export interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
      deg: number;
    };
    dt_txt: string;
  }[];
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
}

interface OpenMeteoGeocodingResponse {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    timezone: string;
  }[];
}

interface OpenMeteoWeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    weather_code: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    is_day: number;
  };
  daily: {
    time: string[];
    weather_code: number[]; // Changed from weather_code_max
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    weather_code: number[];
    pressure_msl: number[];
    surface_pressure: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
  };
  daily_units: {
    temperature_2m_max: string;
  };
  timezone: string;
}

// Map Open-Meteo weather codes to weather conditions and icons
export const mapWeatherCode = (code: number, isDay: number = 1): { main: string; description: string; icon: string; id: number } => {
  // Weather code mapping based on Open-Meteo documentation
  // https://open-meteo.com/en/docs/weather-forecast-api
  const dayOrNight = isDay ? 'd' : 'n';
  
  switch (code) {
    case 0: return { main: 'Clear', description: 'clear sky', icon: `01${dayOrNight}`, id: 800 };
    case 1: return { main: 'Clear', description: 'mainly clear', icon: `01${dayOrNight}`, id: 801 };
    case 2: return { main: 'Clouds', description: 'partly cloudy', icon: `02${dayOrNight}`, id: 802 };
    case 3: return { main: 'Clouds', description: 'overcast', icon: `04${dayOrNight}`, id: 803 };
    case 45:
    case 48: return { main: 'Atmosphere', description: 'fog', icon: `50${dayOrNight}`, id: 741 };
    case 51:
    case 53:
    case 55: return { main: 'Drizzle', description: 'drizzle', icon: `09${dayOrNight}`, id: 300 };
    case 56:
    case 57: return { main: 'Drizzle', description: 'freezing drizzle', icon: `09${dayOrNight}`, id: 301 };
    case 61:
    case 63:
    case 65: return { main: 'Rain', description: 'rain', icon: `10${dayOrNight}`, id: 500 };
    case 66:
    case 67: return { main: 'Rain', description: 'freezing rain', icon: `13${dayOrNight}`, id: 511 };
    case 71:
    case 73:
    case 75: return { main: 'Snow', description: 'snow', icon: `13${dayOrNight}`, id: 600 };
    case 77: return { main: 'Snow', description: 'snow grains', icon: `13${dayOrNight}`, id: 601 };
    case 80:
    case 81:
    case 82: return { main: 'Rain', description: 'rain showers', icon: `09${dayOrNight}`, id: 520 };
    case 85:
    case 86: return { main: 'Snow', description: 'snow showers', icon: `13${dayOrNight}`, id: 620 };
    case 95: return { main: 'Thunderstorm', description: 'thunderstorm', icon: `11${dayOrNight}`, id: 200 };
    case 96:
    case 99: return { main: 'Thunderstorm', description: 'thunderstorm with hail', icon: `11${dayOrNight}`, id: 202 };
    default: return { main: 'Unknown', description: 'unknown weather', icon: `03${dayOrNight}`, id: 804 };
  }
};

// Convert Open-Meteo response to our WeatherData format
const convertToWeatherData = (
  city: string, 
  country: string,
  meteoData: OpenMeteoWeatherResponse
): WeatherData => {
  const weatherCode = meteoData.current.weather_code;
  const isDay = meteoData.current.is_day;
  const weather = mapWeatherCode(weatherCode, isDay);
  
  const date = new Date(meteoData.current.time);
  
  // Calculate sunrise and sunset times (approximation as Open-Meteo doesn't provide these)
  const now = new Date();
  const sunriseTime = new Date(now.setHours(6, 0, 0, 0)).getTime() / 1000;
  const sunsetTime = new Date(now.setHours(18, 0, 0, 0)).getTime() / 1000;
  
  return {
    name: city,
    main: {
      temp: meteoData.current.temperature_2m,
      feels_like: meteoData.current.apparent_temperature,
      temp_min: Math.min(...meteoData.daily.temperature_2m_min),
      temp_max: Math.max(...meteoData.daily.temperature_2m_max),
      humidity: meteoData.current.relative_humidity_2m,
      pressure: meteoData.current.pressure_msl,
    },
    weather: [weather],
    wind: {
      speed: meteoData.current.wind_speed_10m,
      deg: meteoData.current.wind_direction_10m,
    },
    sys: {
      country: country,
      sunrise: sunriseTime,
      sunset: sunsetTime,
    },
    dt: date.getTime() / 1000,
    timezone: 0, // Open-Meteo handles timezone conversions automatically
    visibility: 10000, // Default value as Open-Meteo doesn't provide visibility
  };
};

// Convert Open-Meteo response to our ForecastData format
const convertToForecastData = (
  city: string, 
  country: string,
  meteoData: OpenMeteoWeatherResponse
): ForecastData => {
  // Create daily forecasts
  const forecastList = [];
  
  // We'll create 3-hour forecasts similar to OpenWeatherMap's structure
  // We only have data for 7 days, so we'll use the first 5 days (40 entries)
  for (let day = 0; day < 5; day++) {
    // Create 8 entries per day (3 hours apart)
    for (let hour = 0; hour < 24; hour += 3) {
      const hourIndex = day * 24 + hour;
      if (hourIndex >= meteoData.hourly.time.length) continue;
      
      const time = meteoData.hourly.time[hourIndex];
      const date = new Date(time);
      const weatherCode = meteoData.hourly.weather_code[hourIndex];
      const isDay = (hour >= 6 && hour < 18) ? 1 : 0;
      const weather = mapWeatherCode(weatherCode, isDay);
      
      forecastList.push({
        dt: date.getTime() / 1000,
        main: {
          temp: meteoData.hourly.temperature_2m[hourIndex],
          feels_like: meteoData.hourly.apparent_temperature[hourIndex],
          temp_min: meteoData.hourly.temperature_2m[hourIndex],
          temp_max: meteoData.hourly.temperature_2m[hourIndex],
          humidity: meteoData.hourly.relative_humidity_2m[hourIndex],
          pressure: meteoData.hourly.pressure_msl[hourIndex],
        },
        weather: [weather],
        wind: {
          speed: meteoData.hourly.wind_speed_10m[hourIndex],
          deg: meteoData.hourly.wind_direction_10m[hourIndex],
        },
        dt_txt: date.toISOString(),
      });
    }
  }
  
  return {
    list: forecastList,
    city: {
      name: city,
      country: country,
      sunrise: 0, // Not available directly from Open-Meteo
      sunset: 0, // Not available directly from Open-Meteo
    }
  };
};

// Geocode a city name to get coordinates using Open-Meteo's geocoding API
async function geocodeCity(city: string): Promise<{ city: string, country: string, latitude: number, longitude: number }> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  );
  
  if (!response.ok) {
    throw new Error(`Error geocoding city "${city}": ${response.statusText}`);
  }
  
  const data: OpenMeteoGeocodingResponse = await response.json();
  
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found. Please check the city name and try again.`);
  }
  
  const result = data.results[0];
  return {
    city: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude
  };
}

// Function to fetch current weather data
export const fetchCurrentWeather = async (city: string): Promise<WeatherData> => {
  try {
    // First geocode the city to get coordinates
    const { city: cityName, country, latitude, longitude } = await geocodeCity(city);
    
    // Then fetch weather data using those coordinates
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,apparent_temperature,precipitation,rain,weather_code,pressure_msl,surface_pressure,` +
      `wind_speed_10m,wind_direction_10m,relative_humidity_2m,is_day` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,pressure_msl,surface_pressure,` +
      `wind_speed_10m,wind_direction_10m,relative_humidity_2m` +
      `&timezone=auto`
    );

    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }

    const meteoData: OpenMeteoWeatherResponse = await response.json();
    return convertToWeatherData(cityName, country, meteoData);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Unknown error occurred while fetching weather data.`);
    }
  }
};

// Function to fetch 5-day forecast data
export const fetchForecast = async (city: string): Promise<ForecastData> => {
  try {
    // First geocode the city to get coordinates
    const { city: cityName, country, latitude, longitude } = await geocodeCity(city);
    
    // Then fetch weather data using those coordinates
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,apparent_temperature,precipitation,rain,weather_code,pressure_msl,surface_pressure,` +
      `wind_speed_10m,wind_direction_10m,relative_humidity_2m,is_day` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,pressure_msl,surface_pressure,` +
      `wind_speed_10m,wind_direction_10m,relative_humidity_2m` +
      `&timezone=auto`
    );

    if (!response.ok) {
      throw new Error(`Error fetching forecast data: ${response.statusText}`);
    }

    const meteoData: OpenMeteoWeatherResponse = await response.json();
    return convertToForecastData(cityName, country, meteoData);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Unknown error occurred while fetching forecast data.`);
    }
  }
};

// These functions are no longer needed with Open-Meteo API (no API key required)
// Keeping the function signatures to maintain compatibility with existing code
export const getApiKey = (): string => {
  return "no-key-needed";
};

export const saveApiKey = (key: string): void => {
  // This function is now a no-op, but we keep it for compatibility
  return;
};
