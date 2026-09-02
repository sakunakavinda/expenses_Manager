import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExpenseModal from './components/ExpenseModal';
import ExpenseList from './components/ExpenseList';
import { supabase } from './supabaseClient';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('month');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching expenses:', error);
    } else {
      setExpenses(data || []);
    }
  };

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

  const calculateTrend = () => {
    const now = new Date();
    
    let currentTotal = 0;
    let previousTotal = 0;

    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      
      if (timeFilter === 'today') {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        
        if (expDate.toDateString() === now.toDateString()) {
          currentTotal += exp.amount;
        } else if (expDate.toDateString() === yesterday.toDateString()) {
          previousTotal += exp.amount;
        }
      }
      else if (timeFilter === 'week') {
        // This week: from last Sunday to now
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay());
        startOfThisWeek.setHours(0,0,0,0);
        
        // Last week: from Sunday prior to last Saturday
        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
        const endOfLastWeek = new Date(startOfThisWeek);
        endOfLastWeek.setMilliseconds(endOfLastWeek.getMilliseconds() - 1);

        if (expDate >= startOfThisWeek) {
          currentTotal += exp.amount;
        } else if (expDate >= startOfLastWeek && expDate <= endOfLastWeek) {
          previousTotal += exp.amount;
        }
      }
      else if (timeFilter === 'month') {
        let lastMonth = now.getMonth() - 1;
        let yearOfLastMonth = now.getFullYear();
        if (lastMonth < 0) {
          lastMonth = 11;
          yearOfLastMonth -= 1;
        }
        
        if (expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()) {
          currentTotal += exp.amount;
        } else if (expDate.getMonth() === lastMonth && expDate.getFullYear() === yearOfLastMonth) {
          previousTotal += exp.amount;
        }
      }
      else if (timeFilter === 'year') {
        if (expDate.getFullYear() === now.getFullYear()) {
          currentTotal += exp.amount;
        } else if (expDate.getFullYear() === now.getFullYear() - 1) {
          previousTotal += exp.amount;
        }
      }
    });

    if (previousTotal === 0) return currentTotal > 0 ? 100 : 0;
    return ((currentTotal - previousTotal) / previousTotal) * 100;
  };

  const trend = calculateTrend();

  const handleAddExpense = async (newExpense) => {
    if (!supabase) {
      // Fallback for local testing without Supabase configured
      setExpenses(prev => [{...newExpense, id: Date.now()}, ...prev]);
      return;
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([newExpense])
      .select();

    if (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense.');
    } else if (data && data.length > 0) {
      setExpenses(prev => [data[0], ...prev]);
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <Dashboard 
          totalExpenses={totalFilteredExpenses} 
          timeFilter={timeFilter}
          trend={trend}
          onTimeFilterChange={setTimeFilter}
          onAddExpense={() => setIsModalOpen(true)} 
        />
        
        <ExpenseList expenses={filteredExpenses} />
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
