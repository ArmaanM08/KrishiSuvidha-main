import React from 'react';
import Navigation from '@/components/Navigation';
import WeatherCard from '@/components/WeatherCard';
import CropAdvisoryCard from '@/components/CropAdvisoryCard';
import SoilHealthCard from '@/components/SoilHealthCard';
import MarketPricesCard from '@/components/MarketPricesCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Phone, MessageCircle, Camera, Mic } from 'lucide-react';
import cropHero from '@/assets/crop-hero.jpg';

const Index = () => {
  const quickStats = {
    activeCrops: 4,
    pendingTasks: 7,
    weatherAlerts: 2,
    marketUpdates: 12
  };

  // Redirect to login if not logged in
  React.useEffect(() => {
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="h-64 md:h-80 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${cropHero})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative container flex items-center justify-center h-full text-center">
            <div className="text-white space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold">
                KrishiSuvidha
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                Your AI-Powered Crop Advisory Assistant
              </p>
              <p className="text-lg text-white/80">
                Smart farming solutions for Indian farmers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-primary">{quickStats.activeCrops}</div>
              <p className="text-sm text-muted-foreground">Active Crops</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-warning">{quickStats.pendingTasks}</div>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-destructive">{quickStats.weatherAlerts}</div>
              <p className="text-sm text-muted-foreground">Weather Alerts</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-success">{quickStats.marketUpdates}</div>
              <p className="text-sm text-muted-foreground">Market Updates</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container pb-6">
        <div className="bg-primary/5 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Button variant="outline" className="flex flex-col h-auto py-3 space-y-1">
              <Camera className="w-6 h-6" />
              <span className="text-xs">Pest Detection</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 space-y-1">
              <Mic className="w-6 h-6" />
              <span className="text-xs">Voice Query</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 space-y-1">
              <Bell className="w-6 h-6" />
              <span className="text-xs">Set Alert</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 space-y-1">
              <Phone className="w-6 h-6" />
              <span className="text-xs">Expert Call</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 space-y-1">
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs">Community</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="container pb-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <WeatherCard />
            <SoilHealthCard />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <CropAdvisoryCard />
            <MarketPricesCard />
          </div>
        </div>
      </section>

      {/* Emergency Alerts */}
      <section className="container pb-8">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-destructive">Weather Alert</h4>
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                </div>
                <p className="text-sm">
                  Heavy rainfall expected in the next 48 hours. Secure your crops and ensure proper drainage. 
                  Consider postponing any field activities.
                </p>
                <Button variant="destructive" size="sm" className="mt-2">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-6 text-center">
          <p className="text-sm text-muted-foreground">
            KrishiSuvidha - Empowering farmers with AI-driven insights
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Available in Hindi, Marathi, Gujarati, Telugu, Tamil, and more
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;