import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TestTube, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import soilIcon from '@/assets/soil-icon.png';

const SoilHealthCard = () => {
  const soilData = {
    overallHealth: 78,
    pH: { value: 6.8, status: 'good', ideal: '6.0-7.0' },
    nitrogen: { value: 45, status: 'low', ideal: '50-80 kg/ha' },
    phosphorus: { value: 32, status: 'good', ideal: '25-40 kg/ha' },
    potassium: { value: 180, status: 'high', ideal: '150-200 kg/ha' },
    organicMatter: { value: 2.1, status: 'medium', ideal: '2.5-3.5%' },
    lastTested: '15 days ago',
    nextTest: 'in 45 days'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'destructive';
      case 'high': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'low': return <AlertCircle className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-success';
    if (health >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="shadow-medium hover:shadow-strong transition-smooth">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <img src={soilIcon} alt="Soil Health" className="w-8 h-8" />
          <div>
            <h3 className="text-lg font-semibold">Soil Health</h3>
            <p className="text-sm text-muted-foreground">Field analysis & recommendations</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health Score */}
        <div className="gradient-soil rounded-lg p-4 text-center">
          <div className={`text-4xl font-bold mb-2 ${getHealthColor(soilData.overallHealth)}`}>
            {soilData.overallHealth}%
          </div>
          <p className="text-foreground/80">Overall Soil Health</p>
          <div className="mt-3">
            <Progress value={soilData.overallHealth} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Last tested: {soilData.lastTested}
          </p>
        </div>

        {/* Nutrient Analysis */}
        <div>
          <h4 className="font-semibold mb-3">Nutrient Analysis</h4>
          <div className="space-y-3">
            {/* pH Level */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">pH Level</span>
                  <Badge variant={getStatusColor(soilData.pH.status)} className="text-xs">
                    {getStatusIcon(soilData.pH.status)}
                    <span className="ml-1">{soilData.pH.status}</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Ideal: {soilData.pH.ideal}</p>
              </div>
              <span className="text-xl font-bold">{soilData.pH.value}</span>
            </div>

            {/* Nitrogen */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Nitrogen (N)</span>
                  <Badge variant={getStatusColor(soilData.nitrogen.status)} className="text-xs">
                    {getStatusIcon(soilData.nitrogen.status)}
                    <span className="ml-1">{soilData.nitrogen.status}</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Ideal: {soilData.nitrogen.ideal}</p>
              </div>
              <span className="text-xl font-bold">{soilData.nitrogen.value}</span>
            </div>

            {/* Phosphorus */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Phosphorus (P)</span>
                  <Badge variant={getStatusColor(soilData.phosphorus.status)} className="text-xs">
                    {getStatusIcon(soilData.phosphorus.status)}
                    <span className="ml-1">{soilData.phosphorus.status}</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Ideal: {soilData.phosphorus.ideal}</p>
              </div>
              <span className="text-xl font-bold">{soilData.phosphorus.value}</span>
            </div>

            {/* Potassium */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Potassium (K)</span>
                  <Badge variant={getStatusColor(soilData.potassium.status)} className="text-xs">
                    {getStatusIcon(soilData.potassium.status)}
                    <span className="ml-1">{soilData.potassium.status}</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Ideal: {soilData.potassium.ideal}</p>
              </div>
              <span className="text-xl font-bold">{soilData.potassium.value}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <TestTube className="w-4 h-4 mr-2" />
            Schedule Test
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <TrendingUp className="w-4 h-4 mr-2" />
            View History
          </Button>
        </div>

        {/* Next Test Reminder */}
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-sm text-muted-foreground">
            Next soil test recommended {soilData.nextTest}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilHealthCard;