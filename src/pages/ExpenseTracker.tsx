import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Calculator, Download, DollarSign, Receipt, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  hst: number;
  total: number;
}

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      date: '2024-01-15',
      category: 'Software',
      description: 'Adobe Creative Cloud Subscription',
      amount: 59.99,
      hst: 7.80,
      total: 67.79,
    },
    {
      id: '2',
      date: '2024-02-01',
      category: 'Home Office',
      description: 'New office chair',
      amount: 250.00,
      hst: 32.50,
      total: 282.50,
    },
  ]);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: '',
    category: '',
    description: '',
    amount: 0,
    hst: 0,
    total: 0,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editedExpense, setEditedExpense] = useState<Expense | null>(null);

  const categories = ['Software', 'Home Office', 'Equipment', 'Travel', 'Meals'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setNewExpense({
      ...newExpense,
      category: value,
    });
  };

  const calculateHst = (amount: number) => {
    return parseFloat((amount * 0.13).toFixed(2));
  };

  const calculateTotal = (amount: number, hst: number) => {
    return parseFloat((amount + hst).toFixed(2));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    const hst = calculateHst(amount);
    const total = calculateTotal(amount, hst);

    setNewExpense({
      ...newExpense,
      amount: isNaN(amount) ? 0 : amount,
      hst: isNaN(hst) ? 0 : hst,
      total: isNaN(total) ? 0 : total,
    });
  };

  const addExpense = () => {
    if (!newExpense.date || !newExpense.category || !newExpense.description || !newExpense.amount) {
      toast.error('Please fill in all fields.');
      return;
    }

    const newId = Math.random().toString(36).substring(7);
    const expenseToAdd: Expense = {
      id: newId,
      ...newExpense,
      hst: calculateHst(newExpense.amount),
      total: calculateTotal(newExpense.amount, calculateHst(newExpense.amount)),
    };

    setExpenses([...expenses, expenseToAdd]);
    setNewExpense({
      date: '',
      category: '',
      description: '',
      amount: 0,
      hst: 0,
      total: 0,
    });
    setIsAdding(false);
    toast.success('Expense added successfully!');
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    toast.success('Expense deleted successfully!');
  };

  const startEditing = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setEditedExpense({ ...expense });
  };

  const cancelEditing = () => {
    setEditingExpenseId(null);
    setEditedExpense(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editedExpense) {
      setEditedExpense({
        ...editedExpense,
        [name]: value,
      });
    }
  };

  const handleEditCategoryChange = (value: string) => {
    if (editedExpense) {
      setEditedExpense({
        ...editedExpense,
        category: value,
      });
    }
  };

  const handleEditAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    const hst = calculateHst(amount);
    const total = calculateTotal(amount, hst);

    if (editedExpense) {
      setEditedExpense({
        ...editedExpense,
        amount: isNaN(amount) ? 0 : amount,
        hst: isNaN(hst) ? 0 : hst,
        total: isNaN(total) ? 0 : total,
      });
    }
  };

  const saveExpense = () => {
    if (!editedExpense?.date || !editedExpense?.category || !editedExpense?.description || !editedExpense?.amount) {
      toast.error('Please fill in all fields.');
      return;
    }

    const updatedExpenses = expenses.map((expense) => {
      if (expense.id === editingExpenseId) {
        return {
          ...editedExpense,
          hst: calculateHst(editedExpense.amount),
          total: calculateTotal(editedExpense.amount, calculateHst(editedExpense.amount)),
        };
      }
      return expense;
    });

    setExpenses(updatedExpenses);
    setEditingExpenseId(null);
    setEditedExpense(null);
    toast.success('Expense saved successfully!');
  };

  const calculateTotalDeductions = () => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2);
  };

  const calculateTotalHst = () => {
    return expenses.reduce((acc, expense) => acc + expense.hst, 0).toFixed(2);
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((acc, expense) => acc + expense.total, 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Expense Tracker</CardTitle>
            <CardDescription>Track your freelance expenses to maximize tax deductions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="expenses" className="space-y-4">
              <TabsList>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="capital">Capital Assets (CCA)</TabsTrigger>
                <TabsTrigger value="hst">HST</TabsTrigger>
              </TabsList>
              <TabsContent value="expenses" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Add New Expense</h3>
                    {isAdding ? (
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input type="date" id="date" name="date" value={newExpense.date} onChange={handleInputChange} />

                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={handleCategoryChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={newExpense.description} onChange={handleInputChange} />

                        <Label htmlFor="amount">Amount</Label>
                        <Input type="number" id="amount" name="amount" value={newExpense.amount === 0 ? '' : newExpense.amount} onChange={handleAmountChange} />

                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" onClick={() => setIsAdding(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addExpense}>Add Expense</Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={() => setIsAdding(true)} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Expense
                      </Button>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Current Expenses</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HST</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {expenses.map((expense) => (
                            <tr key={expense.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                              <td className="px-6 py-4">{expense.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap">${expense.amount.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">${expense.hst.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">${expense.total.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                {editingExpenseId === expense.id ? (
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="ghost" onClick={cancelEditing}>
                                      Cancel
                                    </Button>
                                    <Button onClick={saveExpense}>Save</Button>
                                  </div>
                                ) : (
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="secondary" size="sm" onClick={() => startEditing(expense)}>
                                      Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => deleteExpense(expense.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="summary">
                <h3 className="text-lg font-semibold mb-2">Expense Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Deductions:</span>
                    <span>${calculateTotalDeductions()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total HST:</span>
                    <span>${calculateTotalHst()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses:</span>
                    <span>${calculateTotalExpenses()}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="capital">
                <h3 className="text-lg font-semibold mb-2">Capital Assets (CCA)</h3>
                <p>Track and depreciate capital assets such as computers and equipment.</p>
                <Badge variant="outline">Coming Soon</Badge>
              </TabsContent>
              <TabsContent value="hst">
                <h3 className="text-lg font-semibold mb-2">HST Management</h3>
                <p>Calculate Input Tax Credits (ITC) and track HST for quarterly remittance.</p>
                <Badge variant="outline">Coming Soon</Badge>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Edit Expense Modal */}
        {editingExpenseId && editedExpense && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-semibold mb-4">Edit Expense</h3>

              <Label htmlFor="edit-date">Date</Label>
              <Input
                type="date"
                id="edit-date"
                name="date"
                value={editedExpense.date}
                onChange={handleEditInputChange}
                className="mb-2"
              />

              <Label htmlFor="edit-category">Category</Label>
              <Select onValueChange={handleEditCategoryChange} defaultValue={editedExpense.category}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={editedExpense.description}
                onChange={handleEditInputChange}
                className="mb-2"
              />

              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                type="number"
                id="edit-amount"
                name="amount"
                value={editedExpense.amount === 0 ? '' : editedExpense.amount}
                onChange={handleEditAmountChange}
                className="mb-4"
              />

              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button onClick={saveExpense}>Save</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
