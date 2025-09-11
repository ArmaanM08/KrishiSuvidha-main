import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, IndianRupee, Leaf, Calendar } from 'lucide-react';

const marketData = [
  {
    crop: 'Wheat',
    price: 2200,
    unit: 'quintal',
    change: '+2%',
    lastUpdated: '2025-09-10',
  },
  {
    crop: 'Rice',
    price: 1800,
    unit: 'quintal',
    change: '-1%',
    lastUpdated: '2025-09-10',
  },
  {
    crop: 'Sugarcane',
    price: 320,
    unit: 'ton',
    change: '+0.5%',
    lastUpdated: '2025-09-10',
  },
  {
    crop: 'Maize',
    price: 1500,
    unit: 'quintal',
    change: '+3%',
    lastUpdated: '2025-09-10',
  },
];

const MarketPrices: React.FC = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <div className="container py-6 space-y-6">
      <Card className="shadow-medium hover:shadow-strong transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Market Prices</h3>
              <p className="text-sm text-muted-foreground">Latest crop prices & trends</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketData.map((item, idx) => (
              <Card key={idx} className="p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">{item.crop}</span>
                  </div>
                  <Badge variant="secondary">{item.change}</Badge>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <IndianRupee className="w-5 h-5 text-yellow-600" />
                  <span className="text-xl font-bold">{item.price}</span>
                  <span className="text-sm text-muted-foreground">per {item.unit}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: {item.lastUpdated}</span>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default MarketPrices;
