import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

interface Expense {
  id: string;
  date: string;
  vendor: string;
  description: string;
  category: string;
  totalAmount: number;
  hstPaid: number;
  amountBeforeHst: number;
  businessUsePercent: number;
  deductibleAmount: number;
  itcClaimable: number;
  isCapitalAsset: boolean;
  ccaClass?: string;
  fmv?: number;
  notes: string;
}

interface CapitalAsset {
  id: string;
  description: string;
  purchaseDate: string;
  businessStartDate: string;
  originalCost: number;
  fmv: number;
  ccaClass: string;
  ccaRate: number;
  businessUsePercent: number;
  yearlyDepreciation: { year: number; depreciation: number; undepreciatedBalance: number }[];
}

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [capitalAssets, setCapitalAssets] = useState<CapitalAsset[]>([]);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    date: new Date().toISOString().split('T')[0],
    businessUsePercent: 100,
    isCapitalAsset: false
  });
  const [newAsset, setNewAsset] = useState<Partial<CapitalAsset>>({
    businessStartDate: '2025-01-01',
    businessUsePercent: 100,
    ccaClass: '50',
    ccaRate: 55
  });
  
  const { toast } = useToast();

  const categories = [
    'Software/Subscriptions',
    'Office Supplies',
    'Internet/Phone',
    'Travel/Transportation',
    'Meals (50% deductible)',
    'Professional Services',
    'Marketing/Advertising',
    'Home Office',
    'Equipment/Hardware',
    'Education/Training',
    'Banking/Fees',
    'Other'
  ];

  const ccaClasses = [
    { class: '8', rate: 20, description: 'Office furniture, phones' },
    { class: '50', rate: 55, description: 'Computers, software' },
    { class: '12', rate: 100, description: 'Tools under $500' }
  ];

  // Auto-calculate HST and deductible amounts
  useEffect(() => {
    if (newExpense.totalAmount) {
      const hst = newExpense.totalAmount * 0.115; // 13% HST = 0.13/1.13 ≈ 0.115
      const beforeHst = newExpense.totalAmount - hst;
      const businessPortion = (newExpense.businessUsePercent || 100) / 100;
      
      setNewExpense(prev => ({
        ...prev,
        hstPaid: Math.round(hst * 100) / 100,
        amountBeforeHst: Math.round(beforeHst * 100) / 100,
        deductibleAmount: Math.round(beforeHst * businessPortion * 100) / 100,
        itcClaimable: Math.round(hst * businessPortion * 100) / 100
      }));
    }
  }, [newExpense.totalAmount, newExpense.businessUsePercent]);

  const addExpense = () => {
    if (!newExpense.vendor || !newExpense.description || !newExpense.totalAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in vendor, description, and amount",
        variant: "destructive"
      });
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      date: newExpense.date || '',
      vendor: newExpense.vendor || '',
      description: newExpense.description || '',
      category: newExpense.category || 'Other',
      totalAmount: newExpense.totalAmount || 0,
      hstPaid: newExpense.hstPaid || 0,
      amountBeforeHst: newExpense.amountBeforeHst || 0,
      businessUsePercent: newExpense.businessUsePercent || 100,
      deductibleAmount: newExpense.deductibleAmount || 0,
      itcClaimable: newExpense.itcClaimable || 0,
      isCapitalAsset: newExpense.isCapitalAsset || false,
      ccaClass: newExpense.ccaClass,
      fmv: newExpense.fmv,
      notes: newExpense.notes || ''
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      businessUsePercent: 100,
      isCapitalAsset: false
    });
    
    toast({
      title: "Expense Added",
      description: "Successfully tracked your business expense"
    });
  };

  const calculateDepreciation = (asset: Partial<CapitalAsset>) => {
    if (!asset.fmv || !asset.ccaRate) return [];
    
    const years = [];
    let balance = asset.fmv * ((asset.businessUsePercent || 100) / 100);
    const rate = asset.ccaRate / 100;
    
    // Year 1 - Half year rule
    const year1Depreciation = balance * rate * 0.5;
    balance -= year1Depreciation;
    years.push({ year: 1, depreciation: Math.round(year1Depreciation * 100) / 100, undepreciatedBalance: Math.round(balance * 100) / 100 });
    
    // Subsequent years
    for (let year = 2; year <= 5; year++) {
      const depreciation = balance * rate;
      balance -= depreciation;
      years.push({ year, depreciation: Math.round(depreciation * 100) / 100, undepreciatedBalance: Math.round(balance * 100) / 100 });
    }
    
    return years;
  };

  const addCapitalAsset = () => {
    if (!newAsset.description || !newAsset.fmv) {
      toast({
        title: "Missing Information",
        description: "Please fill in description and fair market value",
        variant: "destructive"
      });
      return;
    }

    const asset: CapitalAsset = {
      id: Date.now().toString(),
      description: newAsset.description || '',
      purchaseDate: newAsset.purchaseDate || '',
      businessStartDate: newAsset.businessStartDate || '',
      originalCost: newAsset.originalCost || 0,
      fmv: newAsset.fmv || 0,
      ccaClass: newAsset.ccaClass || '50',
      ccaRate: newAsset.ccaRate || 55,
      businessUsePercent: newAsset.businessUsePercent || 100,
      yearlyDepreciation: calculateDepreciation(newAsset)
    };

    setCapitalAssets([...capitalAssets, asset]);
    setNewAsset({
      businessStartDate: '2025-01-01',
      businessUsePercent: 100,
      ccaClass: '50',
      ccaRate: 55
    });
    
    toast({
      title: "Capital Asset Added",
      description: "CCA depreciation schedule calculated"
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const deleteAsset = (id: string) => {
    setCapitalAssets(capitalAssets.filter(asset => asset.id !== id));
  };

  const exportToCSV = () => {
    const headers = [
      'Date', 'Vendor', 'Description', 'Category', 'Total Amount', 
      'HST Paid', 'Amount Before HST', 'Business Use %', 
      'Deductible Amount', 'ITC Claimable', 'Capital Asset', 'Notes'
    ];
    
    const rows = expenses.map(exp => [
      exp.date, exp.vendor, exp.description, exp.category, exp.totalAmount,
      exp.hstPaid, exp.amountBeforeHst, exp.businessUsePercent,
      exp.deductibleAmount, exp.itcClaimable, exp.isCapitalAsset ? 'Yes' : 'No', exp.notes
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freelance-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalDeductions = expenses.reduce((sum, exp) => sum + exp.deductibleAmount, 0);
  const totalITC = expenses.reduce((sum, exp) => sum + exp.itcClaimable, 0);
  const totalCCAThisYear = capitalAssets.reduce((sum, asset) => 
    sum + (asset.yearlyDepreciation[0]?.depreciation || 0), 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Freelance Expense Tracker</h1>
          <p className="text-gray-600">Track business expenses, HST, and capital asset depreciation for Canadian tax purposes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Deductions</CardTitle>
              <CardDescription>Income tax deductible amount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${(totalDeductions + totalCCAThisYear).toFixed(2)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Expenses: ${totalDeductions.toFixed(2)} + CCA: ${totalCCAThisYear.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">HST Credits (ITC)</CardTitle>
              <CardDescription>HST you can claim back</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${totalITC.toFixed(2)}</div>
              <p className="text-sm text-gray-500 mt-1">Reduces HST owing to CRA</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Capital Assets</CardTitle>
              <CardDescription>Items being depreciated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{capitalAssets.length}</div>
              <p className="text-sm text-gray-500 mt-1">
                Year 1 CCA: ${totalCCAThisYear.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expenses">Regular Expenses</TabsTrigger>
            <TabsTrigger value="assets">Capital Assets</TabsTrigger>
            <TabsTrigger value="summary">Tax Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
                <CardDescription>
                  Track regular business expenses for deductions and HST credits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newExpense.date || ''}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor/Payee</Label>
                    <Input
                      id="vendor"
                      placeholder="e.g., Adobe, Webflow, Bell"
                      value={newExpense.vendor || ''}
                      onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newExpense.category || ''} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="e.g., Monthly subscription, office supplies"
                      value={newExpense.description || ''}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalAmount">Total Amount (incl. HST)</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 113.00"
                      value={newExpense.totalAmount || ''}
                      onChange={(e) => setNewExpense({...newExpense, totalAmount: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessUse">Business Use %</Label>
                    <Input
                      id="businessUse"
                      type="number"
                      max="100"
                      min="0"
                      value={newExpense.businessUsePercent || 100}
                      onChange={(e) => setNewExpense({...newExpense, businessUsePercent: parseInt(e.target.value) || 100})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm text-gray-600">HST Paid</Label>
                    <div className="font-semibold">${(newExpense.hstPaid || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Amount Before HST</Label>
                    <div className="font-semibold">${(newExpense.amountBeforeHst || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Deductible Amount</Label>
                    <div className="font-semibold text-green-600">${(newExpense.deductibleAmount || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">ITC Claimable</Label>
                    <div className="font-semibold text-blue-600">${(newExpense.itcClaimable || 0).toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Additional details for tax purposes"
                    value={newExpense.notes || ''}
                    onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                  />
                </div>

                <Button onClick={addExpense} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Expense History</CardTitle>
                  <CardDescription>{expenses.length} expenses tracked</CardDescription>
                </div>
                <Button onClick={exportToCSV} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No expenses tracked yet. Add your first expense above!</p>
                  ) : (
                    expenses.map((expense) => (
                      <div key={expense.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{expense.description}</h3>
                              <Badge variant="secondary">{expense.category}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{expense.vendor} • {expense.date}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => deleteExpense(expense.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Total: </span>
                            <span className="font-medium">${expense.totalAmount.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Deductible: </span>
                            <span className="font-medium text-green-600">${expense.deductibleAmount.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">ITC: </span>
                            <span className="font-medium text-blue-600">${expense.itcClaimable.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Business: </span>
                            <span className="font-medium">{expense.businessUsePercent}%</span>
                          </div>
                        </div>
                        {expense.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">"{expense.notes}"</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Capital Asset</CardTitle>
                <CardDescription>
                  Track assets like computers, furniture, etc. for CCA depreciation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assetDescription">Description</Label>
                    <Input
                      id="assetDescription"
                      placeholder="e.g., MacBook Pro for design work"
                      value={newAsset.description || ''}
                      onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Original Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={newAsset.purchaseDate || ''}
                      onChange={(e) => setNewAsset({...newAsset, purchaseDate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessStartDate">Business Start Date</Label>
                    <Input
                      id="businessStartDate"
                      type="date"
                      value={newAsset.businessStartDate || ''}
                      onChange={(e) => setNewAsset({...newAsset, businessStartDate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalCost">Original Cost (Optional)</Label>
                    <Input
                      id="originalCost"
                      type="number"
                      step="0.01"
                      placeholder="What you originally paid"
                      value={newAsset.originalCost || ''}
                      onChange={(e) => setNewAsset({...newAsset, originalCost: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fmv">Fair Market Value (Required)</Label>
                    <Input
                      id="fmv"
                      type="number"
                      step="0.01"
                      placeholder="Value when business started"
                      value={newAsset.fmv || ''}
                      onChange={(e) => setNewAsset({...newAsset, fmv: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ccaClassSelect">CCA Class</Label>
                    <Select value={newAsset.ccaClass || ''} onValueChange={(value) => {
                      const selectedClass = ccaClasses.find(c => c.class === value);
                      setNewAsset({...newAsset, ccaClass: value, ccaRate: selectedClass?.rate || 55});
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select CCA class" />
                      </SelectTrigger>
                      <SelectContent>
                        {ccaClasses.map(cls => (
                          <SelectItem key={cls.class} value={cls.class}>
                            Class {cls.class} ({cls.rate}%) - {cls.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assetBusinessUse">Business Use %</Label>
                    <Input
                      id="assetBusinessUse"
                      type="number"
                      max="100"
                      min="0"
                      value={newAsset.businessUsePercent || 100}
                      onChange={(e) => setNewAsset({...newAsset, businessUsePercent: parseInt(e.target.value) || 100})}
                    />
                  </div>
                </div>

                {newAsset.fmv && newAsset.ccaRate && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">CCA Preview (5 Years)</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {calculateDepreciation(newAsset).map((year) => (
                        <div key={year.year} className="text-center">
                          <div className="font-medium">Year {year.year}</div>
                          <div className="text-green-600">${year.depreciation}</div>
                          <div className="text-gray-500 text-xs">Balance: ${year.undepreciatedBalance}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={addCapitalAsset} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Capital Asset
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capital Assets</CardTitle>
                <CardDescription>{capitalAssets.length} assets tracked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {capitalAssets.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No capital assets tracked yet. Add assets like computers, furniture, etc. above!</p>
                  ) : (
                    capitalAssets.map((asset) => (
                      <div key={asset.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{asset.description}</h3>
                            <p className="text-sm text-gray-600">
                              Class {asset.ccaClass} • {asset.ccaRate}% rate • {asset.businessUsePercent}% business use
                            </p>
                            <p className="text-sm text-gray-600">
                              FMV: ${asset.fmv} • Started: {asset.businessStartDate}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => deleteAsset(asset.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                          {asset.yearlyDepreciation.map((year) => (
                            <div key={year.year} className="text-center p-2 bg-gray-50 rounded">
                              <div className="font-medium">Year {year.year}</div>
                              <div className="text-green-600 font-semibold">${year.depreciation}</div>
                              <div className="text-gray-500 text-xs">Bal: ${year.undepreciatedBalance}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income Tax Deductions (T2125)</CardTitle>
                  <CardDescription>Reduces your taxable income</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Regular business expenses:</span>
                    <span className="font-semibold">${totalDeductions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capital Cost Allowance (CCA):</span>
                    <span className="font-semibold">${totalCCAThisYear.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Deductions:</span>
                    <span className="text-green-600">${(totalDeductions + totalCCAThisYear).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    This reduces your taxable income by ${(totalDeductions + totalCCAThisYear).toFixed(2)}, 
                    saving you approximately ${((totalDeductions + totalCCAThisYear) * 0.3).toFixed(2)} in taxes 
                    (assuming 30% marginal rate).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>HST Return (Input Tax Credits)</CardTitle>
                  <CardDescription>Reduces HST you owe to CRA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>HST paid on business expenses:</span>
                    <span className="font-semibold">${totalITC.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>HST collected from clients:</span>
                    <span>[Enter when filing HST return]</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>ITC Claimable:</span>
                    <span className="text-blue-600">${totalITC.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    You can claim ${totalITC.toFixed(2)} back from the CRA, 
                    reducing your HST remittance or getting a refund if you paid more HST than you collected.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tax Preparation Checklist</CardTitle>
                <CardDescription>What you'll need for tax time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span>Export expense data to CSV for accountant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span>Gather receipts for expenses over $30</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span>Calculate home office expenses (if applicable)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span>Prepare T2125 form with total deductions: ${(totalDeductions + totalCCAThisYear).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span>File HST return with ITC claim: ${totalITC.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span>Update CCA schedule for capital assets</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExpenseTracker;
