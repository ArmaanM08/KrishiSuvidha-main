import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sprout, AlertTriangle, CheckCircle, Calendar, Droplets } from 'lucide-react';
import cropHealthIcon from '@/assets/crop-health-icon.png';

interface CropData {
  id: number;
  crop: string;
  stage: string;
  priority: string;
  action: string;
  details: string;
  daysLeft: number;
  status: string;
  suitability: number;
  nextSeason: string;
}

const CropAdvisoryCard = () => {
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  const fetchCropData = async (lat: number, lon: number) => {
    try {
      // Fetch weather data first
      const weatherRes = await fetch(`https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${lat},${lon}`);
      const weatherData = await weatherRes.json();

      // Then fetch crop recommendations based on weather and location
      const cropRes = await fetch('http://localhost:5000/api/crop-advisory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lon,
          temperature: weatherData.current.temp_c,
          humidity: weatherData.current.humidity,
          rainfall: weatherData.current.precip_mm,
          soilMoisture: weatherData.current.humidity // approximation
        })
      });

      const cropData = await cropRes.json();
      setCropData(cropData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch crop advisory data');
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
          setError('Location access denied');
          setLoading(false);
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError('Geolocation is not supported');
      setLoading(false);
    }
  }, []);

  // Fetch data when location changes
  useEffect(() => {
    if (location) {
      fetchCropData(location.lat, location.lon);
      
      // Refresh every 30 minutes
      const interval = setInterval(() => {
        fetchCropData(location.lat, location.lon);
      }, 1800000);

      return () => clearInterval(interval);
    }
  }, [location]);

  if (loading) {
    return <Card className="shadow-medium p-6 text-center">Loading crop advisory...</Card>;
  }

  if (error) {
    return <Card className="shadow-medium p-6 text-center text-red-500">{error}</Card>;
  }

  return (
    <Card className="shadow-medium hover:shadow-strong transition-smooth">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <img src={cropHealthIcon} alt="Crop Health" className="w-8 h-8" />
          <div>
            <h3 className="text-lg font-semibold">Crop Advisory</h3>
            <p className="text-sm text-muted-foreground">Based on current conditions</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cropData.map((advisory) => (
          <div
            key={advisory.id}
            className="p-4 rounded-lg border bg-card hover:bg-accent transition-smooth"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold flex items-center">
                  <Sprout className="w-4 h-4 mr-2 text-green-500" />
                  {advisory.crop}
                </h4>
                <p className="text-sm text-muted-foreground">{advisory.stage}</p>
              </div>
              <Badge
                variant={
                  advisory.priority === 'high'
                    ? 'destructive'
                    : advisory.priority === 'medium'
                    ? 'warning'
                    : 'default'
                }
              >
                {advisory.status}
              </Badge>
            </div>
            
            <p className="text-sm mb-3">{advisory.details}</p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  {advisory.daysLeft} days left
                </span>
                <span className="flex items-center text-muted-foreground">
                  <Droplets className="w-4 h-4 mr-1" />
                  Suitability: {advisory.suitability}%
                </span>
              </div>
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CropAdvisoryCard;