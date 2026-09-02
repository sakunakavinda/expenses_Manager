import React from 'react';
import { Plus, TrendingUp } from 'lucide-react';

const Dashboard = ({ totalExpenses, timeFilter, onTimeFilterChange, onAddExpense }) => {
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
          <div className="trend">
            <TrendingUp size={16} color="var(--danger-color)" />
            <span>+2.4% from last month</span>
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
