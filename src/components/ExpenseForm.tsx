import React, { useState, useEffect } from "react";
import axios from "axios"; // You can also use fetch API instead of axios

interface Expense {
  description: string;
  amount: number;
  date: string;
}

const ExpenseForm: React.FC = () => {
  // Local state for form inputs
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch all expenses from the backend when the component mounts
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/expense`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Simple validation
    if (!description || !amount || !date) {
      alert("Please fill out all fields.");
      return;
    }

    // Prepare the new expense
    const newExpense = {
      description,
      amount: parseFloat(amount),
      date,
    };

    try {
      // Send POST request to backend to save the expense
      await axios.post(`${apiUrl}/expense`, newExpense);
      alert("Expense saved!");

      // Clear the form inputs after submission
      setDescription("");
      setAmount("");
      setDate("");

      // Fetch updated expenses from backend
      fetchExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  return (
    <div>
      <h2>Add an Expense</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="description">Description: </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        <div>
          <label htmlFor="amount">Amount: </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label htmlFor="date">Date: </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button type="submit">Add Expense</button>
      </form>

      <h3>Expenses List:</h3>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.description} - ${expense.amount} on {expense.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseForm;
