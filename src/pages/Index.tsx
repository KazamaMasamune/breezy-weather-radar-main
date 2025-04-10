
import React from 'react';
import WeatherDashboard from '@/components/WeatherDashboard';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <WeatherDashboard />
    </div>
  );
};

export default Index;
