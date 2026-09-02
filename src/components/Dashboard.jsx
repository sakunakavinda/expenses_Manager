import React from 'react';
import { Plus, TrendingUp } from 'lucide-react';

const Dashboard = ({ totalExpenses, onAddExpense }) => {
  return (
    <section className="dashboard">
      <div className="dashboard-cards">
        <div className="card balance-card glass-panel">
          <h3>Total Expenses</h3>
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
