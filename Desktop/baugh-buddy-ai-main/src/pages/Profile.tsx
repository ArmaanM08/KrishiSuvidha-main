import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Crop,
  TrendingUp,
  Award,
  Settings,
  Bell,
  Languages,
  HelpCircle,
  LogOut,
  Edit3
} from 'lucide-react';

const Profile = () => {
  // Soil test file import handler
  const handleSoilTestImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('http://localhost:5000/api/soil-test/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('soilTestData', JSON.stringify(data.soilData));
      alert('Soil test data processed successfully!');
    } else {
      alert('Error processing soil test data');
    }
  } catch (error) {
    alert('Error uploading file');
  }
  };
  // For navigation
  const navigateToLogin = () => {
    localStorage.removeItem('userProfile');
    window.location.href = '/login';
  };
  // Try to get user data from localStorage
  const storedProfile = typeof window !== 'undefined' ? localStorage.getItem('userProfile') : null;
  const userProfile = storedProfile ? JSON.parse(storedProfile) : null;
  const farmerData = {
    name: userProfile?.name || 'Rajesh Kumar',
    phone: userProfile?.phone || '+91 98765 43210',
    location: userProfile?.location || 'Mandya, Karnataka',
    farmSize: userProfile?.size ? `${userProfile.size} acres` : '2.5 acres',
    joinDate: 'March 2024',
    totalHarvests: 12,
    bestYield: '4.2 tons/acre',
    primaryCrops: ['Rice', 'Wheat', 'Sugarcane'],
    languages: ['Hindi', 'Kannada', 'English']
  };

  const recentActivities = [
    { date: '2024-01-15', activity: 'Soil pH testing completed', type: 'soil' },
    { date: '2024-01-14', activity: 'Weather alert acknowledged', type: 'weather' },
    { date: '2024-01-12', activity: 'Fertilizer recommendation followed', type: 'advisory' },
    { date: '2024-01-10', activity: 'Crop advisory requested for Rice', type: 'advisory' }
  ];

  const achievements = [
    { title: 'Early Adopter', description: 'First month user', icon: '🌱' },
    { title: 'Soil Expert', description: '10 soil tests completed', icon: '🧪' },
    { title: 'Weather Wise', description: 'Never missed weather alerts', icon: '🌦️' },
    { title: 'Community Helper', description: 'Helped 5+ farmers', icon: '🤝' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-6 space-y-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Import Soil Test File</h2>
            <input type="file" accept=".json" onChange={handleSoilTestImport} className="mb-2" />
            <p className="text-sm text-muted-foreground">Upload a soil test file (JSON format).</p>
          </CardContent>
        </Card>
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" alt={farmerData.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {farmerData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold">{farmerData.name}</h1>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{farmerData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{farmerData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {farmerData.joinDate}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {farmerData.primaryCrops.map((crop) => (
                    <Badge key={crop} variant="secondary">
                      <Crop className="w-3 h-3 mr-1" />
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Statistics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{farmerData.farmSize}</div>
              <p className="text-sm text-muted-foreground">Farm Size</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">{farmerData.totalHarvests}</div>
              <p className="text-sm text-muted-foreground">Total Harvests</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">{farmerData.bestYield}</div>
              <p className="text-sm text-muted-foreground">Best Yield</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'soil' ? 'bg-warning' :
                    activity.type === 'weather' ? 'bg-destructive' :
                    'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Settings & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Settings & Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Preferences */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Preferred Languages</Label>
              <div className="flex flex-wrap gap-2">
                {farmerData.languages.map((lang) => (
                  <Badge key={lang} variant="outline">
                    <Languages className="w-3 h-3 mr-1" />
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Quick Settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto py-3">
                <Bell className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Notification Settings</div>
                  <div className="text-xs text-muted-foreground">Manage alerts & reminders</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-3">
                <Languages className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Language Settings</div>
                  <div className="text-xs text-muted-foreground">Change app language</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-3">
                <HelpCircle className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Help & Support</div>
                  <div className="text-xs text-muted-foreground">Get help & tutorials</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-3 text-destructive hover:text-destructive" onClick={navigateToLogin}>
                <LogOut className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Sign Out</div>
                  <div className="text-xs text-muted-foreground">Logout from account</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;