import React from 'react';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = ({ totalExpenses, timeFilter, trend = 0, onTimeFilterChange, onAddExpense, onViewReport }) => {
  const getTrendText = () => {
    switch (timeFilter) {
      case 'today': return 'from yesterday';
      case 'week': return 'from last week';
      case 'month': return 'from last month';
      case 'year': return 'from last year';
      default: return '';
    }
  };

  return (
    <section className="dashboard">
      <div className="dashboard-cards">
        <div className="card balance-card glass-panel">
          <div className="balance-header">
            <h3>Total Expenses</h3>
            <div className="filter-toggle">
              <button 
                className={`toggle-btn ${timeFilter === 'today' ? 'active' : ''}`}
                onClick={() => onTimeFilterChange('today')}
              >Today</button>
              <button 
                className={`toggle-btn ${timeFilter === 'week' ? 'active' : ''}`}
                onClick={() => onTimeFilterChange('week')}
              >Week</button>
              <button 
                className={`toggle-btn ${timeFilter === 'month' ? 'active' : ''}`}
                onClick={() => onTimeFilterChange('month')}
              >Month</button>
              <button 
                className={`toggle-btn ${timeFilter === 'year' ? 'active' : ''}`}
                onClick={() => onTimeFilterChange('year')}
              >Year</button>
            </div>
          </div>
          <h2 className="amount">LKR {totalExpenses.toFixed(2)}</h2>
          <div className="trend" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {trend >= 0 ? (
                <TrendingUp size={16} color="var(--danger-color)" />
              ) : (
                <TrendingDown size={16} color="var(--success-color)" />
              )}
              <span style={{ color: trend >= 0 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                {trend >= 0 ? '+' : ''}{trend.toFixed(1)}% {getTrendText()}
              </span>
            </div>
            {onViewReport && (
              <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={onViewReport}>
                View Full Report
              </button>
            )}
          </div>
        </div>
        
        <div className="card action-card glass-panel">
          <div className="action-content">
            <h3>Add New Expense</h3>
            <p>Record a new transaction</p>
          </div>
          <button className="btn-primary pulse-anim" onClick={onAddExpense}>
            <Plus size={20} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
