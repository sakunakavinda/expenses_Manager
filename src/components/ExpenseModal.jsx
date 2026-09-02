import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Instruments',
  'Repair',
  'Transport',
  'Marketing',
  'Wifi',
  'Other'
];

const ExpenseModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: CATEGORIES[0],
    description: '',
    billNo: ''
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setFormData({
        amount: '',
        category: CATEGORIES[0],
        description: '',
        billNo: ''
      });
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    
    onSave({
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      bill_number: formData.billNo,
      date: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel bounce-in">
        <div className="modal-header">
          <h2>New Expense</h2>
          <button className="icon-btn" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label htmlFor="amount">Amount (LKR)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <div className="select-wrapper">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Short Description</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="What was this for?"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="billNo">Bill No (Optional)</label>
            <input
              type="text"
              id="billNo"
              name="billNo"
              placeholder="e.g. INV-1234"
              value={formData.billNo}
              onChange={handleChange}
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
