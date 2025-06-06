
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, FileSpreadsheet } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Freelance Tax Tracker</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={location.pathname === '/' ? 'default' : 'outline'}
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
            <Button
              variant={location.pathname === '/tracker' ? 'default' : 'outline'}
              onClick={() => navigate('/tracker')}
              className="flex items-center space-x-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Expense Tracker</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
