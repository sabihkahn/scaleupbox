import React, { useState, useEffect } from 'react';

const ExpenseTracker = () => {
  const [expensename, setexpensename] = useState('');
  const [expenseamount, setexpenseamount] = useState('');
  const [catogery, setcatogery] = useState('');
  const [date, setdate] = useState('');
  const [expensedata, setexpensedata] = useState([]);
  const [fooddata, setfooddata] = useState([]);
  const [errors, setErrors] = useState({});

  const id = expensedata.length;

  const isFormInvalid =
    !expensename.trim() ||
    !expenseamount ||
    expenseamount <= 0 ||
    !catogery ||
    !date;

  // Submit handler
  const handelsubmit = () => {
    const newErrors = {};
    if (!expensename.trim()) newErrors.expensename = 'Expense name is required';
    if (!expenseamount || expenseamount <= 0)
      newErrors.expenseamount = 'Amount must be greater than 0';
    if (!catogery) newErrors.catogery = 'Please select a category';
    if (!date) newErrors.date = 'Please select a date';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const expenseobj = {
      id,
      expensename,
      expenseamount,
      catogery,
      date,
    };

    setExpensedataSafe(expenseobj);

    // Reset form
    setexpensename('');
    setexpenseamount('');
    setcatogery('');
    setdate('');
  };

  // Safely update expensedata and then fooddata
  const setExpensedataSafe = (expenseobj) => {
    setexpensedata((prev) => [...prev, expenseobj]);
  };

  // Effect to update fooddata after expensedata changes
  useEffect(() => {
    if (expensedata.length === 0) return;

    // Update in a microtask to avoid synchronous state update warning
    const timeout = setTimeout(() => {
      const foodExpenses = expensedata
        .filter((item) => item.catogery === 'food')
        .map((item, index) => ({ ...item, id: index }));

      setfooddata(foodExpenses);
    }, 0);

    return () => clearTimeout(timeout);
  }, [expensedata]);

  // Log effect
  useEffect(() => {
    console.log('All Expenses:', expensedata);
    console.log('Food Expenses:', fooddata);
  }, [expensedata, fooddata]);

  return (
    <div className="min-h-screen flex bg-gray-100 px-4  not-lg:justify-center ">
      <div className="w-[90%] max-w-4xl bg-white rounded-2xl shadow-xl p-4 md:p-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Expense Tracker
        </h1>

        <div className="flex flex-col md:flex-row md:items-end md:gap-4 gap-4">
          {/* Expense Name */}
          <div className="flex flex-col md:w-1/4 w-full">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Expense Name
            </label>
            <input
              type="text"
              placeholder="Coffee, Uber, Rent"
              value={expensename}
              onChange={(e) => setexpensename(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.expensename && (
              <span className="text-xs text-red-500 mt-1">{errors.expensename}</span>
            )}
          </div>

          {/* Amount */}
          <div className="flex flex-col md:w-1/4 w-full">
            <label className="text-sm font-medium text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              placeholder="0"
              value={expenseamount}
              onChange={(e) => setexpenseamount(e.target.valueAsNumber)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.expenseamount && (
              <span className="text-xs text-red-500 mt-1">{errors.expenseamount}</span>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col md:w-1/4 w-full">
            <label className="text-sm font-medium text-gray-600 mb-1">Category</label>
            <select
              value={catogery}
              onChange={(e) => setcatogery(e.target.value)}
              className="px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select</option>
              <option value="food">Food & Dining</option>
              <option value="travel">Travel</option>
              <option value="shopping">Shopping</option>
              <option value="rent">Rent</option>
              <option value="utilities">Utilities</option>
              <option value="transport">Transport</option>
              <option value="health">Health</option>
              <option value="entertainment">Entertainment</option>
              <option value="education">Education</option>
              <option value="subscription">Subscriptions</option>
            </select>
            {errors.catogery && (
              <span className="text-xs text-red-500 mt-1">{errors.catogery}</span>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col md:w-1/4 w-full">
            <label className="text-sm font-medium text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setdate(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.date && (
              <span className="text-xs text-red-500 mt-1">{errors.date}</span>
            )}
          </div>

          {/* Button */}
          <div className="md:w-auto w-full">
            <button
              onClick={handelsubmit}
              disabled={isFormInvalid}
              className={`
                w-full md:w-auto
                px-8 py-3
                rounded-lg
                font-medium
                transition
                ${isFormInvalid
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-900'}
              `}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
