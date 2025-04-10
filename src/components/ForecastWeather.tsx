
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ForecastData } from '@/services/weatherApi';
import { formatDate, formatTemperature, getWeatherIconUrl, groupForecastByDay } from '@/utils/weatherUtils';

interface ForecastWeatherProps {
  data: ForecastData;
}

const ForecastWeather: React.FC<ForecastWeatherProps> = ({ data }) => {
  if (!data || !data.list) return null;
  
  const dailyForecasts = groupForecastByDay(data.list).slice(0, 5);
  
  return (
    <div className="animate-fade-in">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {dailyForecasts.map((day, index) => (
              <div key={index} className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="font-semibold">{formatDate(day.dt)}</div>
                <img 
                  src={getWeatherIconUrl(day.weather.icon)} 
                  alt={day.weather.description}
                  className="h-12 w-12 my-2"
                />
                <div className="text-sm capitalize">{day.weather.description}</div>
                <div className="mt-1 flex items-center justify-between w-full">
                  <span>{formatTemperature(day.temp_min)}</span>
                  <span className="mx-2">-</span>
                  <span>{formatTemperature(day.temp_max)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastWeather;
