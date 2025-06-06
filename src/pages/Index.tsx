
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, FileSpreadsheet, TrendingUp, Receipt, DollarSign, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Freelance Tax Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Simplify your Canadian freelance taxes. Track expenses, calculate deductions, 
            manage HST, and handle capital asset depreciation - all in one place.
          </p>
          <Button 
            onClick={() => navigate('/tracker')} 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg"
          >
            Start Tracking Expenses
            <FileSpreadsheet className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-green-600 mb-2" />
              <CardTitle>Maximize Deductions</CardTitle>
              <CardDescription>
                Track all eligible business expenses and automatically calculate your tax savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Software subscriptions</li>
                <li>• Home office expenses</li>
                <li>• Equipment depreciation</li>
                <li>• Travel & meals</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Receipt className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>HST Management</CardTitle>
              <CardDescription>
                Calculate Input Tax Credits (ITC) and track HST for quarterly remittance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Auto-calculate 13% HST</li>
                <li>• Track ITC claimable</li>
                <li>• Export for CRA filing</li>
                <li>• Reduce HST owing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-purple-600 mb-2" />
              <CardTitle>Capital Assets (CCA)</CardTitle>
              <CardDescription>
                Properly depreciate computers, furniture, and equipment using CRA guidelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Computer depreciation</li>
                <li>• Furniture & equipment</li>
                <li>• Half-year rule application</li>
                <li>• Multi-year schedules</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tax Savings Calculator */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardHeader className="text-center">
            <Calculator className="h-12 w-12 text-orange-600 mx-auto mb-2" />
            <CardTitle className="text-2xl">Quick Tax Savings Example</CardTitle>
            <CardDescription>
              See how much you could save by properly tracking your freelance expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-red-600">❌ Without Proper Tracking</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Freelance Income:</span>
                    <span>$50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deductions Claimed:</span>
                    <span>$1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxable Income:</span>
                    <span>$49,000</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Estimated Tax + CPP:</span>
                    <span className="text-red-600">$14,700</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-green-600">✅ With Proper Tracking</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Freelance Income:</span>
                    <span>$50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deductions Claimed:</span>
                    <span>$8,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxable Income:</span>
                    <span>$41,500</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Estimated Tax + CPP:</span>
                    <span className="text-green-600">$12,450</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                Annual Tax Savings: $2,250
              </div>
              <p className="text-sm text-gray-600">
                Plus HST savings from Input Tax Credits on business expenses
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Track Expenses</h3>
              <p className="text-sm text-gray-600">Add your business expenses with automatic HST calculation</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Categorize Items</h3>
              <p className="text-sm text-gray-600">Organize expenses and add capital assets for depreciation</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Review Summary</h3>
              <p className="text-sm text-gray-600">See total deductions and HST credits automatically calculated</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Export & File</h3>
              <p className="text-sm text-gray-600">Export CSV for your accountant and file with confidence</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <FileText className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <CardTitle className="text-2xl">Ready to Optimize Your Taxes?</CardTitle>
            <CardDescription>
              Start tracking your freelance expenses today and maximize your tax savings for 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/tracker')} 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3"
            >
              Launch Expense Tracker
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Free to use • Canadian tax compliant • Export ready
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
