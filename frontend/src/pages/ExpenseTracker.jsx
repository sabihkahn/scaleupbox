import React, { useState, useEffect, useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { AlertTriangle, Wallet, Trash2, PlusCircle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ExpenseTracker = () => {
  // 1. STATE MANAGEMENT - Lazy load from LocalStorage
  const [expensedata, setexpensedata] = useState(() => {
    const stored = localStorage.getItem('expenses');
    return stored ? JSON.parse(stored) : [];
  });

  const [income, setIncome] = useState(() => {
    return Number(localStorage.getItem('income')) || 0;
  });

  const [form, setForm] = useState({ name: '', amount: '', category: '', date: '' });
  const [errors, setErrors] = useState({});
  console.log(errors);

  // 2. PERSISTENCE
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expensedata));
    localStorage.setItem('income', income.toString());
  }, [expensedata, income]);

  // 3. DERIVED DATA (Calculated on every render for efficiency)
  const totalExpense = expensedata.reduce((sum, e) => sum + Number(e.amount), 0);
  const balance = income - totalExpense;

  const categoryTotals = useMemo(() => {
    return expensedata.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    }, {});
  }, [expensedata]);

  // 4. CHART DATA
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      label: 'Expenses by Category',
      data: Object.values(categoryTotals),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ],
      hoverOffset: 4
    }]
  };

  // 5. HANDLERS
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.category || !form.date) {
      setErrors({ general: "All fields are required" });
      return;
    }

    const newExpense = {
      id: Date.now(), // Better unique ID than array length
      ...form,
      amount: Number(form.amount)
    };

    setexpensedata([newExpense, ...expensedata]);
    setForm({ name: '', amount: '', category: '', date: '' });
    setErrors({});
  };

  const deleteExpense = (id) => {
    setexpensedata(expensedata.filter(exp => exp.id !== id));
  };

  return (
    <div className="min-h-screen overflow-y-scroll p-7 bg-gray-50 mb-6 md:p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Input & Budget */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wallet className="text-blue-500" /> Budget Overview
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Monthly Income</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full text-2xl font-bold border-b focus:border-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600">Balance</p>
                  <p className={`font-bold ${balance < 0 ? 'text-red-500' : ''}`}>${balance.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-600">Spent</p>
                  <p className="font-bold">${totalExpense.toFixed(2)}</p>
                </div>
              </div>
              {balance < 0 && (
                <div className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded-lg text-sm animate-pulse">
                  <AlertTriangle size={16} /> Budget Exceeded!
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleAddExpense} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-lg">Add New Expense</h3>
            <input
              placeholder="Expense Name"
              className="w-full p-3 border rounded-xl"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Amount"
                className="p-3 border rounded-xl"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <select
                className="p-3 border rounded-xl bg-white"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Category</option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="rent">Rent</option>
                <option value="entertainment">Fun</option>
              </select>
            </div>
            <input
              type="date"
              className="w-full p-3 border rounded-xl"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <button type="submit" className="w-full bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
              <PlusCircle size={20} /> Add Expense
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Visualization & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold mb-4">Spending Breakdown</h3>
              <div className="h-64">
                {expensedata.length > 0 ? (
                  <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">No data yet</div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-y-auto max-h-[400px]">
              <h3 className="font-bold mb-4">Recent History</h3>
              <div className="space-y-3">
                {expensedata.map((exp) => (
                  <div key={exp.id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50 transition">
                    <div>
                      <p className="font-medium">{exp.name}</p>
                      <p className="text-xs text-gray-400">{exp.date} • <span className="capitalize">{exp.category}</span></p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">-${exp.amount}</span>
                      <button onClick={() => deleteExpense(exp.id)} className="text-gray-500 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
