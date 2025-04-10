
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherData } from '@/services/weatherApi';
import { formatTemperature, formatDate, formatTime, getWeatherIconUrl } from '@/utils/weatherUtils';
import { Wind, Droplets, Gauge, Eye } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  if (!data) return null;
  
  const weatherIconUrl = getWeatherIconUrl(data.weather[0].icon);

  return (
    <div className="animate-fade-in">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{data.name}, {data.sys.country}</h2>
              <p className="text-sm text-muted-foreground">{formatDate(data.dt)}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{formatTemperature(data.main.temp)}</div>
              <div className="text-sm text-muted-foreground">
                Feels like {formatTemperature(data.main.feels_like)}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={weatherIconUrl} 
                alt={data.weather[0].description}
                className="h-16 w-16 mr-2"
              />
              <div>
                <p className="font-medium capitalize">{data.weather[0].description}</p>
              </div>
            </div>
            <div className="text-sm">
              <div className="mb-1">
                H: {formatTemperature(data.main.temp_max)} L: {formatTemperature(data.main.temp_min)}
              </div>
              <div className="flex items-center gap-1">
                <span>Sunrise: {formatTime(data.sys.sunrise)}</span>
                <span>•</span>
                <span>Sunset: {formatTime(data.sys.sunset)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center">
              <Wind className="h-4 w-4 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Wind</p>
                <p>{data.wind.speed} m/s</p>
              </div>
            </div>
            <div className="flex items-center">
              <Droplets className="h-4 w-4 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p>{data.main.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center">
              <Gauge className="h-4 w-4 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pressure</p>
                <p>{data.main.pressure} hPa</p>
              </div>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p>{(data.visibility / 1000).toFixed(1)} km</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentWeather;
