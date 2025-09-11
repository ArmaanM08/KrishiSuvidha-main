import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, IndianRupee, MapPin, Calendar } from 'lucide-react';

const MarketPricesCard = () => {
  const marketData = [
    {
      crop: 'Rice',
      variety: 'Basmati',
      currentPrice: 2850,
      previousPrice: 2780,
      change: 2.5,
      market: 'Pune APMC',
      unit: 'per quintal',
      trend: 'up',
      demand: 'high'
    },
    {
      crop: 'Wheat',
      variety: 'Lokvan',
      currentPrice: 2150,
      previousPrice: 2200,
      change: -2.3,
      market: 'Pune APMC',
      unit: 'per quintal',
      trend: 'down',
      demand: 'medium'
    },
    {
      crop: 'Sugarcane',
      variety: 'Co-86032',
      currentPrice: 315,
      previousPrice: 310,
      change: 1.6,
      market: 'Pune APMC',
      unit: 'per quintal',
      trend: 'up',
      demand: 'high'
    },
    {
      crop: 'Cotton',
      variety: 'Bt Cotton',
      currentPrice: 5850,
      previousPrice: 5750,
      change: 1.7,
      market: 'Pune APMC',
      unit: 'per quintal',
      trend: 'up',
      demand: 'medium'
    }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-success" /> : 
      <TrendingDown className="w-4 h-4 text-destructive" />;
  };

  const getTrendColor = (change: number) => {
    return change > 0 ? 'text-success' : 'text-destructive';
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <Card className="shadow-medium hover:shadow-strong transition-smooth">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <IndianRupee className="w-8 h-8 text-success" />
            <div>
              <h3 className="text-lg font-semibold">Market Prices</h3>
              <p className="text-sm text-muted-foreground">Live pricing from APMC</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            Updated 2h ago
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Best Price */}
        <div className="gradient-sunset rounded-lg p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-white/90 text-sm">Today's Best Price</p>
              <h4 className="text-2xl font-bold">₹{marketData[0].currentPrice}</h4>
              <p className="text-white/90">{marketData[0].crop} - {marketData[0].variety}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-white">
                {getTrendIcon(marketData[0].trend)}
                <span className="font-semibold">+{marketData[0].change}%</span>
              </div>
              <p className="text-white/80 text-sm">{marketData[0].unit}</p>
            </div>
          </div>
        </div>

        {/* Price List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">All Crops</h4>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>Pune APMC</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {marketData.map((item, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-muted/50 transition-smooth">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold">{item.crop}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.variety}
                      </Badge>
                      <Badge variant={getDemandColor(item.demand)} className="text-xs">
                        {item.demand} demand
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.unit}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">₹{item.currentPrice}</span>
                      {getTrendIcon(item.trend)}
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <span className="text-muted-foreground">₹{item.previousPrice}</span>
                      <span className={`font-medium ${getTrendColor(item.change)}`}>
                        ({item.change > 0 ? '+' : ''}{item.change}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <TrendingUp className="w-4 h-4 mr-2" />
            Price Alerts
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <MapPin className="w-4 h-4 mr-2" />
            Other Markets
          </Button>
        </div>

        {/* Market Insights */}
        <div className="bg-muted/50 rounded-lg p-3">
          <h5 className="font-medium mb-2">💡 Market Insight</h5>
          <p className="text-sm text-muted-foreground">
            Rice prices are trending upward due to increased demand for Basmati varieties. 
            Consider selling your current stock within the next week for better profits.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketPricesCard;