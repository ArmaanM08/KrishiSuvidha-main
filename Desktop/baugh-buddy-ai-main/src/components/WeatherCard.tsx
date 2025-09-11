import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Droplets, Eye, Wind, Sun, CloudRain, Clock } from 'lucide-react';
import weatherIcon from '@/assets/weather-icon.png';

const WEATHERAPI_KEY = '82aa6fc667b0427da73171641251109'; // <-- Replace with your WeatherAPI.com API key
const REFRESH_INTERVAL = 300000; // Refresh every 5 minutes

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      // Current weather
      const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}`);
      const data = await res.json();
      // 3-day forecast
      const resForecast = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}&days=4`);
      const forecastData = await resForecast.json();

      // Parse forecast for next 4 days
      const forecast = forecastData.forecast.forecastday.map((day: any, idx: number) => ({
        day: idx === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.round(day.day.maxtemp_c),
        low: Math.round(day.day.mintemp_c),
        condition: day.day.condition.text.toLowerCase().includes('rain') ? 'rainy' : day.day.condition.text.toLowerCase().includes('sun') ? 'sunny' : 'cloudy',
        rain: day.day.daily_chance_of_rain
      }));

      setWeatherData({
        location: `${data.location.name}, ${data.location.region}`,
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        visibility: data.current.vis_km,
        uvIndex: data.current.uv,
        rainfall: data.current.precip_mm,
        forecast,
        lastUpdated: new Date().toLocaleTimeString()
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data.');
      setLoading(false);
    }
  };

  // Watch for location changes
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        () => {
          setError('Location access denied.');
          setLoading(false);
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError('Geolocation is not supported.');
      setLoading(false);
    }
  }, []);

  // Fetch weather data when location changes or on interval
  useEffect(() => {
    if (location) {
      fetchWeatherData(location.lat, location.lon);

      const interval = setInterval(() => {
        fetchWeatherData(location.lat, location.lon);
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
      default: return <Cloud className="w-6 h-6 text-gray-500" />;
    }
  };

  if (loading) {
    return <Card className="shadow-medium p-6 text-center">Loading weather...</Card>;
  }
  if (error) {
    return <Card className="shadow-medium p-6 text-center text-red-500">{error}</Card>;
  }

  return (
    <Card className="shadow-medium hover:shadow-strong transition-smooth">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <img src={weatherIcon} alt="Weather" className="w-8 h-8" />
          <div>
            <h3 className="text-lg font-semibold">Weather Overview</h3>
            <div className="flex items-center text-sm text-muted-foreground space-x-2">
              <span>{weatherData.location}</span>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>Updated: {weatherData.lastUpdated}</span>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Weather */}
        <div className="gradient-sky rounded-lg p-4 text-center">
          <div className="text-4xl font-bold text-white mb-2">
            {weatherData.temperature}°C
          </div>
          <p className="text-white/90">{weatherData.condition}</p>
          <Badge variant="secondary" className="mt-2">
            <Droplets className="w-4 h-4 mr-1" />
            {weatherData.rainfall}mm expected
          </Badge>
        </div>

        {/* Weather Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="font-semibold">{weatherData.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
              <p className="font-semibold">{weatherData.windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-muted-foreground">Visibility</p>
              <p className="font-semibold">{weatherData.visibility} km</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">UV Index</p>
              <p className="font-semibold">{weatherData.uvIndex}</p>
            </div>
          </div>
        </div>

        {/* 4-Day Forecast */}
        <div>
          <h4 className="font-semibold mb-3">4-Day Forecast</h4>
          <div className="space-y-2">
            {weatherData.forecast.map((day: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  {getWeatherIcon(day.condition)}
                  <span className="font-medium">{day.day}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">{day.rain}%</span>
                  <span className="font-semibold">{day.high}°/{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;