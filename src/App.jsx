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

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <Dashboard 
          totalExpenses={totalExpenses} 
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
