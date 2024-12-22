import React, { useState, useEffect } from "react";
import "./App.css";
import { getAllExpenses, addExpense, deleteExpense, updateExpense } from './api';

export default function Expense() {
    const [transactions, setTransactions] = useState([]);
    const [isCashOpen, setIsCashOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formType, setFormType] = useState("");
    const [formData, setFormData] = useState({
        amount: "",
        date: "",
        purpose: "",
        paymentMode: "Cash",
    });

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const data = await getAllExpenses();
                setTransactions(data);
            } catch (error) {
                console.error('Error loading expenses', error);
            }
        };

        fetchExpenses();
    }, []);

    const openCash = (type) => {
        setFormType(type);
        setIsCashOpen(true);
        setFormData({ 
          amount: "", 
          date: "", 
          purpose: "", 
          paymentMode: "Cash", 
          type: type 
      });
    };

    const openEdit = (transaction) => {
        setFormType('Edit');
        setIsEditOpen(true);
        setFormData(transaction);
    };

    const closeModal = () => {
        setIsCashOpen(false);
        setIsEditOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { amount, date, purpose, paymentMode, type } = formData;

        if (!amount || !date || !purpose || !paymentMode) {
            alert("Please fill all fields.");
            return;
        }

        try {
            if (formType === "Cash In" || formType === "Cash Out") {
                const newExpense = { amount, date, purpose, paymentMode, type };
                const savedExpense = await addExpense(newExpense);
                setTransactions((prev) => [...prev, savedExpense]);
            } else if (formType === "Edit") {
                const updatedExpense = await updateExpense(formData.id, formData);
                setTransactions((prev) =>
                    prev.map((expense) =>
                        expense.id === updatedExpense.id ? updatedExpense : expense
                    )
                );
            }
            closeModal();
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            setTransactions((prev) => prev.filter((expense) => expense.id !== id));
        } catch (error) {
            console.error('Error deleting expense', error);
        }
    };

    return (
        <div className="App">
            <div className="button-class">
                <button onClick={() => openCash("Cash In")} className="cashin-button">
                    Cash In
                </button>
                <button onClick={() => openCash("Cash Out")} className="cashout-button">
                    Cash Out
                </button>
            </div>

            {(isCashOpen || isEditOpen) && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>{formType} Form</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="amount">Amount:</label>
                                <input
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    max="100000"
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date">Date:</label>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="purpose">Purpose:</label>
                                <input
                                    type="text"
                                    name="purpose"
                                    id="purpose"
                                    value={formData.purpose}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="paymentMode">Payment Method:</label>
                                <select
                                    name="paymentMode"
                                    id="paymentMode"
                                    value={formData.paymentMode}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Online">Online</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <div className="button-group">
                                <button type="button" className="cancel-button" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-button">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Purpose</th>
                        <th>Payment Mode</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.type}</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.purpose}</td>
                            <td>{transaction.paymentMode}</td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(transaction.id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="edit-button"
                                    onClick={() => openEdit(transaction)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
