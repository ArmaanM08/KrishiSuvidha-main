import { Home, Sprout, MapPin, TrendingUp, Bell, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/contexts/TranslationContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage, setLanguage } = useTranslation();
  
  const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Sprout, label: 'Crop Advisory', path: '/crop-advisory' },
  { icon: MapPin, label: 'Soil Health', path: '/soil-health' },
  { icon: TrendingUp, label: 'Market Prices', path: '/market-prices' },
  { icon: User, label: 'Profile', path: '/profile' }
  ];

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`${mobile ? 'flex flex-col space-y-4 p-6' : 'hidden md:flex md:space-x-8'}`}>
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant={location.pathname === item.path ? "default" : "ghost"}
          className={`${mobile ? 'justify-start w-full' : ''} transition-smooth`}
          onClick={() => navigate(item.path)}
        >
          <item.icon className="w-5 h-5 mr-2" />
          {item.label}
        </Button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">KrishiSuvidha</h1>
          </div>
          
          <NavContent />
          
          <div className="flex items-center space-x-4">
            <LanguageSelector 
              currentLanguage={currentLanguage} 
              onLanguageChange={setLanguage}
            />
          </div>

          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex items-center space-x-2 mb-8">
                <Sprout className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">KrishiSuvidha</h1>
              </div>
              <NavContent mobile />
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
};

export default Navigation;