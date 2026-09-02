import React from 'react';
import { Coffee, Music, PenTool, Bus, Megaphone, Wifi, Receipt } from 'lucide-react';

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
    case 'Other': return '#a3a3a3'; /* Gray for other */
    default: return 'var(--text-secondary)';
  }
};

const ExpenseList = ({ expenses, onViewReport }) => {
  if (expenses.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <div className="empty-icon">
          <Receipt size={48} />
        </div>
        <h3>No expenses yet</h3>
        <p>Click the Add Expense button to get started.</p>
      </div>
    );
  }

  return (
    <section className="expense-list-section">
      <div className="list-header">
        <div className="list-header-left">
          <h2>Recent Expenses</h2>
          <span className="count-badge">{expenses.length}</span>
        </div>
        <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={onViewReport}>
          View Full Report
        </button>
      </div>
      
      <div className="expense-list">
        {expenses.map((expense, index) => (
          <div 
            key={expense.id} 
            className="expense-item glass-panel fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="expense-icon" style={{ backgroundColor: getCategoryColor(expense.category) + '33', color: getCategoryColor(expense.category) }}>
              {getCategoryIcon(expense.category)}
            </div>
            
            <div className="expense-details">
              <h4>{expense.description}</h4>
              <div className="expense-meta">
                <span className="category-tag">{expense.category}</span>
                {expense.bill_number && (
                  <span className="bill-tag">Bill: {expense.bill_number}</span>
                )}
              </div>
            </div>
            
            <div className="expense-amount">
              LKR {expense.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpenseList;
