
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, FileSpreadsheet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Freelance Tax Tracker
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          
          <Link to="/tracker">
            <Button 
              variant={location.pathname === '/tracker' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Expense Tracker
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
