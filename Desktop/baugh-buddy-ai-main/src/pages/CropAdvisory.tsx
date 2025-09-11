import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sprout, 
  Calendar, 
  Droplets,
  Sun,
  Bug,
  Leaf,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Thermometer,
  CloudRain,
  Lightbulb,
  Camera,
  Mic
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface DiseaseDetection {
  disease: string;
  confidence: number;
  description: string;
  treatment: string;
  preventiveMeasures: string[];
}

const CropAdvisory = () => {
  const [currentRecommendations, setCurrentRecommendations] = useState([]);
  const [location, setLocation] = useState({ lat: 0, lon: 0, name: '' });
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [seasonalAdvice, setSeasonalAdvice] = useState([]);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [diseaseDetection, setDiseaseDetection] = useState<DiseaseDetection | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageLoading(true);
    setError(null);
    setSelectedImage(URL.createObjectURL(file));
    setDiseaseDetection(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('Sending image for disease detection...');
      const response = await fetch('http://localhost:5000/api/crop-advisory/detect-disease', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      const result = await response.json();
      console.log('Disease detection result:', result);
      
      if (!result.disease) {
        throw new Error('Invalid response format from server');
      }

      setDiseaseDetection(result);
    } catch (error) {
      console.error('Error detecting disease:', error);
      setError(error instanceof Error ? error.message : 'Failed to process image');
      setDiseaseDetection(null);
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          
          try {
            // Fetch weather data
            const weatherRes = await fetch(
              `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${lat},${lon}`
            );
            const weatherData = await weatherRes.json();
            setWeatherData(weatherData);
            setLocation({ 
              lat, 
              lon, 
              name: weatherData.location.name + ', ' + weatherData.location.region 
            });

            // Fetch all data from backend
            const [cropRes, seasonalRes, pestsRes, insightsRes] = await Promise.all([
              fetch('http://localhost:5000/api/crop-advisory', {
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
                  soilMoisture: weatherData.current.humidity
                })
              }),
              fetch('http://localhost:5000/api/crop-advisory/seasonal'),
              fetch('http://localhost:5000/api/crop-advisory/pests'),
              fetch('http://localhost:5000/api/crop-advisory/insights')
            ]);

            const [cropData, seasonalData, pestsData, insightsData] = await Promise.all([
              cropRes.json(),
              seasonalRes.json(),
              pestsRes.json(),
              insightsRes.json()
            ]);

            setCurrentRecommendations(cropData);
            setSeasonalAdvice(seasonalData);
            setPestAlerts(pestsData);
            setAiInsights(insightsData);
            setLoading(false);
          } catch (err) {
            console.error('Error fetching data:', err);
            setLoading(false);
          }
        },
        (err) => {
          console.error('Location error:', err);
          setLoading(false);
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <Sprout className="w-8 h-8 text-primary" />
              <span>Crop Advisory</span>
            </h1>
            <p className="text-muted-foreground">AI-powered farming recommendations for your crops</p>
          </div>
          
          <div className="flex space-x-2">
            <Label htmlFor="cropImage" className="cursor-pointer">
              <div className="flex items-center px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                <Camera className="w-4 h-4 mr-2" />
                <span>Crop Health Scan</span>
              </div>
              <input
                id="cropImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </Label>
            <Button variant="outline">
              <Mic className="w-4 h-4 mr-2" />
              Voice Query
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">{location.name || 'Loading location...'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-warning" />
                <span className="text-sm">
                  {weatherData ? `${weatherData.current.temp_c}°C` : 'Loading...'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  {weatherData ? `${weatherData.current.humidity}% Humidity` : 'Loading...'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-success" />
                <span className="text-sm">
                  {currentRecommendations?.[0]?.nextSeason || 'Loading...'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">Current Tasks</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal Guide</TabsTrigger>
            <TabsTrigger value="pests">Pest Alerts</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Current Recommendations */}
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid gap-4">
              {currentRecommendations.map((rec) => (
                <Card key={rec.id} className={`${
                  rec.priority === 'high' ? 'border-destructive/30 bg-destructive/5' :
                  rec.priority === 'medium' ? 'border-warning/30 bg-warning/5' :
                  'border-success/30 bg-success/5'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Leaf className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">{rec.crop}</h3>
                          <Badge variant="outline" className="text-xs">
                            {rec.stage}
                          </Badge>
                          <Badge variant={
                            rec.priority === 'high' ? 'destructive' :
                            rec.priority === 'medium' ? 'warning' :
                            'success'
                          } className="text-xs">
                            {rec.priority.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <p className="text-sm mb-2">{rec.action}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Due: {rec.deadline}</span>
                          </div>
                          {rec.weather_dependent && (
                            <div className="flex items-center space-x-1">
                              <Sun className="w-3 h-3" />
                              <span>Weather dependent</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Done
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add New Query */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ask Our AI Assistant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crop-select">Select Crop</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="maize">Maize</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="stage-select">Growth Stage</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Current stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seedling">Seedling</SelectItem>
                        <SelectItem value="vegetative">Vegetative</SelectItem>
                        <SelectItem value="flowering">Flowering</SelectItem>
                        <SelectItem value="maturity">Maturity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="query">Your Question</Label>
                  <Textarea 
                    id="query"
                    placeholder="Describe your crop issue or ask for advice..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button className="w-full">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Get AI Recommendation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seasonal Guide */}
          <TabsContent value="seasonal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>January 2024 - Farming Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {seasonalAdvice.map((advice, index) => (
                  <div key={index} className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Essential Tasks</h4>
                      <ul className="space-y-2">
                        {advice.tasks.map((task, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                            <span className="text-sm">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Recommended Planting</h4>
                      <div className="flex flex-wrap gap-2">
                        {advice.crops_to_plant.map((crop, idx) => (
                          <Badge key={idx} variant="secondary">
                            <Sprout className="w-3 h-3 mr-1" />
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold mb-1 text-blue-800">Weather Advisory</h4>
                      <p className="text-sm text-blue-700">{advice.weather_tips}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pest Alerts */}
          <TabsContent value="pests" className="space-y-4">
            <div className="grid gap-4">
              {pestAlerts.map((alert, index) => (
                <Card key={index} className="border-warning/30 bg-warning/5">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Bug className="w-5 h-5 text-warning" />
                          <h3 className="font-semibold">{alert.pest}</h3>
                          <Badge variant={
                            alert.severity === 'High' ? 'destructive' :
                            alert.severity === 'Medium' ? 'warning' :
                            'secondary'
                          }>
                            {alert.severity} Risk
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Affected Crops: </span>
                            {alert.crops.join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">Region: </span>
                            {alert.region}
                          </div>
                          <div>
                            <span className="font-medium">Symptoms: </span>
                            {alert.symptoms}
                          </div>
                          <div className="bg-success/10 p-2 rounded">
                            <span className="font-medium text-success">Treatment: </span>
                            {alert.treatment}
                          </div>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        More Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Insights */}
          <TabsContent value="ai-insights" className="space-y-4">
            <div className="grid gap-4">
              {aiInsights.map((insight, index) => (
                <Card key={index} className="border-primary/30 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="w-6 h-6 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge variant="outline">
                            {insight.confidence}% Confidence
                          </Badge>
                        </div>
                        
                        <p className="text-sm mb-2">{insight.insight}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Source: {insight.source}</span>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>AI Generated</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Custom AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Crop Disease Detection</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a photo of your crop to identify diseases and get treatment recommendations.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Image Upload Area */}
                    <Card className="border-dashed border-2">
                      <CardContent className="p-6">
                        {selectedImage ? (
                          <div className="relative aspect-video">
                            <img 
                              src={selectedImage} 
                              alt="Selected crop" 
                              className="w-full h-full object-cover rounded-md"
                            />
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="absolute top-2 right-2"
                              onClick={() => setSelectedImage(null)}
                            >
                              Change Photo
                            </Button>
                          </div>
                        ) : (
                          <Label 
                            htmlFor="cropImage" 
                            className="flex flex-col items-center justify-center h-[200px] cursor-pointer"
                          >
                            <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Click to upload crop photo</span>
                          </Label>
                        )}
                      </CardContent>
                    </Card>

                    {/* Detection Results */}
                    <Card>
                      <CardContent className="p-6">
                        {imageLoading ? (
                          <div className="flex flex-col items-center justify-center h-[200px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
                            <p className="text-sm text-muted-foreground">Analyzing image...</p>
                          </div>
                        ) : error ? (
                          <div className="flex flex-col items-center justify-center h-[200px] text-center">
                            <AlertTriangle className="w-8 h-8 text-destructive mb-2" />
                            <p className="text-sm text-destructive font-medium">{error}</p>
                          </div>
                        ) : diseaseDetection ? (
                          <div className="space-y-4">
                            <div>
                              <Badge variant={diseaseDetection.confidence > 80 ? "destructive" : "warning"}>
                                {diseaseDetection.confidence}% Confidence
                              </Badge>
                              <h4 className="text-lg font-semibold mt-2">{diseaseDetection.disease}</h4>
                              <p className="text-sm text-muted-foreground">{diseaseDetection.description}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-1">Treatment</h5>
                              <p className="text-sm">{diseaseDetection.treatment}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-1">Preventive Measures</h5>
                              <ul className="text-sm space-y-1">
                                {diseaseDetection.preventiveMeasures.map((measure, i) => (
                                  <li key={i} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                                    <span>{measure}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] text-center">
                            <AlertTriangle className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              No disease detection results yet.<br />
                              Upload an image to begin analysis.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col space-y-2">
                    <Camera className="w-6 h-6" />
                    <span>Upload Crop Image</span>
                    <span className="text-xs text-muted-foreground">For disease detection</span>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col space-y-2">
                    <Mic className="w-6 h-6" />
                    <span>Voice Description</span>
                    <span className="text-xs text-muted-foreground">Describe your issue</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CropAdvisory;