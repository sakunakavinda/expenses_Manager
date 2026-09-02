import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExpenseModal from './components/ExpenseModal';
import ExpenseList from './components/ExpenseList';

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('month');

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const getFilteredExpenses = () => {
    const now = new Date();
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      if (timeFilter === 'today') {
        return expDate.toDateString() === now.toDateString();
      }
      if (timeFilter === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
        return expDate >= startOfWeek;
      }
      if (timeFilter === 'month') {
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
      }
      if (timeFilter === 'year') {
        return expDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const totalFilteredExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <Dashboard 
          totalExpenses={totalFilteredExpenses} 
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          onAddExpense={() => setIsModalOpen(true)} 
        />
        
        <ExpenseList expenses={expenses} />
      </main>

      <ExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddExpense}
      />
    </div>
  );
}

export default App;
