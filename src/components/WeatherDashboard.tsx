
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import ForecastWeather from './ForecastWeather';
import { fetchCurrentWeather, fetchForecast, WeatherData, ForecastData } from '@/services/weatherApi';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { getWeatherBackgroundClass } from '@/utils/weatherUtils';

const WeatherDashboard: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [backgroundClass, setBackgroundClass] = useState<string>('weather-gradient-day');
  const { toast } = useToast();

  useEffect(() => {
    // Load default city on mount (no API key check needed anymore)
    fetchWeatherData('London');
  }, []);

  // Update background when weather data changes
  useEffect(() => {
    if (currentWeather?.weather?.[0]) {
      const newBackgroundClass = getWeatherBackgroundClass(
        currentWeather.weather[0].main,
        currentWeather.weather[0].icon
      );
      setBackgroundClass(newBackgroundClass);
    }
  }, [currentWeather]);

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError('');
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(cityName),
        fetchForecast(cityName)
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setCity(cityName);
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (cityName: string) => {
    fetchWeatherData(cityName);
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${backgroundClass}`}>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Weather Dashboard</h1>
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

        {error && (
          <Card className="mb-6 border-red-200">
            <CardContent className="p-4">
              <div className="text-red-500">{error}</div>
            </CardContent>
          </Card>
        )}

        {currentWeather && (
          <div className="space-y-6">
            <CurrentWeather data={currentWeather} />
            {forecast && <ForecastWeather data={forecast} />}
          </div>
        )}

        <div className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs text-center text-muted-foreground">
                <p>Data provided by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Open-Meteo</a></p>
                <p className="mt-1">Free weather API with no authentication required</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
