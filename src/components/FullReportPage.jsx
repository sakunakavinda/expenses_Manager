import React, { useState } from 'react';
import { ArrowLeft, Coffee, Music, PenTool, Bus, Megaphone, Wifi, Receipt } from 'lucide-react';

const CATEGORIES = ['Food', 'Instruments', 'Repair', 'Transport', 'Marketing', 'Wifi', 'Other'];

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Food': return <Coffee size={20} />;
    case 'Instruments': return <Music size={20} />;
    case 'Repair': return <PenTool size={20} />;
    case 'Transport': return <Bus size={20} />;
    case 'Marketing': return <Megaphone size={20} />;
    case 'Wifi': return <Wifi size={20} />;
    case 'Other': return <Receipt size={20} />;
    default: return <Receipt size={20} />;
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'Food': return 'var(--cat-food)';
    case 'Instruments': return 'var(--cat-instruments)';
    case 'Repair': return 'var(--cat-repair)';
    case 'Transport': return 'var(--cat-transport)';
    case 'Marketing': return 'var(--cat-marketing)';
    case 'Wifi': return 'var(--cat-wifi)';
    case 'Other': return '#a3a3a3';
    default: return 'var(--text-secondary)';
  }
};

const FullReportPage = ({ expenses, onBack }) => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Generate last 12 months for the horizontal selector
  const recentMonths = React.useMemo(() => {
    const months = [];
    const d = new Date();
    for(let i=0; i<12; i++) {
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const labelStr = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      months.push({ value: monthStr, label: labelStr });
      d.setMonth(d.getMonth() - 1);
    }
    return months.reverse(); // Oldest on left, newest on right
  }, []);

  // Filter expenses based on selected filters
  const getFilteredExpenses = () => {
    const now = new Date();
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      
      if (timeFilter === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0,0,0,0);
        return expDate >= startOfWeek;
      }
      if (timeFilter === 'month') {
        const expMonth = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
        return expMonth === selectedMonth;
      }
      if (timeFilter === 'year') {
        return expDate.getFullYear() === now.getFullYear();
      }
      return true; // fallback
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Group by category
  const categoryTotals = CATEGORIES.map(category => {
    const total = filteredExpenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { category, total };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total); // Only show categories with expenses, sorted by amount

  return (
    <div className="report-page fade-in-up">
      <div className="report-header">
        <button className="btn-secondary btn-small" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h2>Detailed Analytics</h2>
      </div>

      <div className="card glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div className="balance-header">
          <h3>Total Expenses</h3>
          <div className="filter-toggle" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              className={`toggle-btn ${timeFilter === 'week' ? 'active' : ''}`}
              onClick={() => setTimeFilter('week')}
            >This Week</button>
            <button 
              className={`toggle-btn ${timeFilter === 'month' ? 'active' : ''}`}
              onClick={() => setTimeFilter('month')}
            >Month</button>
            <button 
              className={`toggle-btn ${timeFilter === 'year' ? 'active' : ''}`}
              onClick={() => setTimeFilter('year')}
            >This Year</button>
            
            
            {timeFilter === 'month' && (() => {
              const currentMonthInt = parseInt(selectedMonth.split('-')[1], 10);
              return (
                <div className="diamond-slider-container" style={{ width: '100%', marginTop: '2.5rem', padding: '0 1rem', position: 'relative' }}>
                  
                  {/* Tooltip */}
                  <div className="slider-tooltip" style={{ left: `calc(1rem + ${((currentMonthInt - 1) / 11) * (100)}% - ${((currentMonthInt - 1) / 11) * 2}rem)` }}>
                    {new Date(parseInt(selectedMonth.split('-')[0]), currentMonthInt - 1).toLocaleString('default', { month: 'short', year: '2-digit' })}
                  </div>
                  
                  {/* Custom track and thumb */}
                  <div className="diamond-track">
                    <div className="diamond-fill" style={{ width: `${((currentMonthInt - 1) / 11) * 100}%` }}></div>
                    
                    <div 
                      className="diamond-node filled"
                      style={{ left: `calc(${((currentMonthInt - 1) / 11) * 100}%)` }}
                    ></div>
                  </div>

                  {/* Invisible native range input for dragging support */}
                  <input 
                    type="range" 
                    min="1" 
                    max="12" 
                    value={currentMonthInt}
                    onChange={(e) => {
                      const year = selectedMonth.split('-')[0];
                      const newMonth = String(e.target.value).padStart(2, '0');
                      setSelectedMonth(`${year}-${newMonth}`);
                    }}
                    className="invisible-slider"
                  />
                </div>
              );
            })()}
          </div>
        </div>
        <h2 className="amount" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
          LKR {totalAmount.toFixed(2)}
        </h2>

        <h4>Category Breakdown</h4>
        <div className="category-grid">
          {categoryTotals.length > 0 ? categoryTotals.map(item => (
            <div key={item.category} className="category-card glass-panel">
              <div className="expense-icon" style={{ backgroundColor: getCategoryColor(item.category) + '33', color: getCategoryColor(item.category), width: '40px', height: '40px' }}>
                {getCategoryIcon(item.category)}
              </div>
              <div className="cat-details">
                <span className="cat-name">{item.category}</span>
                <span className="cat-total">LKR {item.total.toFixed(2)}</span>
              </div>
            </div>
          )) : (
            <p style={{ color: 'var(--text-secondary)' }}>No expenses in this period.</p>
          )}
        </div>
      </div>

      <div className="card glass-panel report-table-card">
        <h3>Transactions List</h3>
        <div className="report-table-wrapper" style={{ marginTop: '1rem', maxHeight: '500px' }}>
          <table className="report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Bill No</th>
                <th>Amount (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>{exp.description}</td>
                    <td>
                      <span className="category-tag" style={{ backgroundColor: getCategoryColor(exp.category) + '22', color: getCategoryColor(exp.category) }}>
                        {exp.category}
                      </span>
                    </td>
                    <td>{exp.bill_number || '-'}</td>
                    <td style={{ fontWeight: '600' }}>{exp.amount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    No expenses recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FullReportPage;
