import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Leaf, FlaskConical, Sun, CloudRain } from 'lucide-react';

const getSoilData = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('soilTestData') : null;
  if (stored) return JSON.parse(stored);
  return {
    location: 'Your Field',
    ph: 6.8,
    moisture: 22,
    nitrogen: 'Optimal',
    phosphorus: 'Low',
    potassium: 'High',
    organicMatter: 'Good',
    lastTested: '2025-09-01',
    recommendations: [
      'Add phosphorus-rich fertilizer',
      'Maintain regular irrigation',
      'Monitor pH monthly',
      'Increase organic compost'
    ]
  };
};

const SoilHealth: React.FC = () => {
  const soilData = getSoilData();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-6 space-y-6">
        <Card className="shadow-medium hover:shadow-strong transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold">Soil Health Overview</h3>
                <p className="text-sm text-muted-foreground">{soilData.location}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <FlaskConical className="w-5 h-5 text-yellow-700" />
                <div>
                  <p className="text-sm text-muted-foreground">pH Level</p>
                  <p className="font-semibold">{soilData.ph}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Moisture</p>
                  <p className="font-semibold">{soilData.moisture}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Organic Matter</p>
                  <p className="font-semibold">{soilData.organicMatter}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CloudRain className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Tested</p>
                  <p className="font-semibold">{soilData.lastTested}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">N</Badge>
                <div>
                  <p className="text-sm text-muted-foreground">Nitrogen</p>
                  <p className="font-semibold">{soilData.nitrogen}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">P</Badge>
                <div>
                  <p className="text-sm text-muted-foreground">Phosphorus</p>
                  <p className="font-semibold">{soilData.phosphorus}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">K</Badge>
                <div>
                  <p className="text-sm text-muted-foreground">Potassium</p>
                  <p className="font-semibold">{soilData.potassium}</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="list-disc pl-6 text-muted-foreground">
                {soilData.recommendations.map((rec: string, idx: number) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoilHealth;
