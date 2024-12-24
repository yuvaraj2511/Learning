import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/expense'; 

export const getAllExpenses = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error in getAllExpenses', error);
        throw error;
    }
};

export const addExpense = async (expenseData) => {
    try {
        const response = await axios.post(`${BASE_URL}/cash-in`, expenseData);
        return response.data;
    } catch (error) {
        console.error('Error in addExpense', error);
        throw error;
    }
};

export const deleteExpense = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/delete/${id}`);
    } catch (error) {
        console.error('Error in deleteExpense', error);
        throw error;
    }
};

export const updateExpense = async (id, updatedData) => {
    try {
        const response = await axios.put(`${BASE_URL}/put/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error in updateExpense', error);
        throw error;
    }
};
