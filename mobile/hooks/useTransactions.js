import { useCallback, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { API_URL } from "../constants/api";

export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = useCallback(async () => {
        try {
            const state = await NetInfo.fetch();
            if (!state.isConnected) {
                throw new Error("No internet connection");
            }
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText} - ${errorText}`);
            }
            const data = await response.json();
            setTransactions(Array.isArray(data) ? data : []);
            setError(null);
        } catch (error) {
            console.error("Error fetching transactions:", {
                message: error.message,
                userId,
                apiUrl: `${API_URL}/transactions/${userId}`,
            });
            setError(error.message || "Failed to fetch transactions");
            setTransactions([]);
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        try {
            const state = await NetInfo.fetch();
            if (!state.isConnected) {
                throw new Error("No internet connection");
            }
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch summary: ${response.status} ${response.statusText} - ${errorText}`);
            }
            const data = await response.json();
            if (!data || typeof data !== "object") {
                throw new Error("Invalid summary data received");
            }
            setSummary({
                balance: Number(data.balance) || 0,
                income: Number(data.income) || 0,
                expenses: Number(data.expenses) || 0,
            });
            setError(null);
        } catch (error) {
            console.error("Error fetching summary:", {
                message: error.message,
                userId,
                apiUrl: `${API_URL}/transactions/summary/${userId}`,
            });
            setError(error.message || "Failed to fetch summary");
            setSummary({ balance: 0, income: 0, expenses: 0 });
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);
        try {
            await fetchTransactions();
            await fetchSummary();
        } catch (error) {
            console.error("Error loading data:", error);
            setError(error.message || "Failed to load data");
        } finally {
            setIsLoading(false);
        }
    }, [fetchTransactions, fetchSummary, userId]);

    const deleteTransaction = async (id) => {
        try {
            const state = await NetInfo.fetch();
            if (!state.isConnected) {
                throw new Error("No internet connection");
            }
            const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete transaction: ${response.status} ${response.statusText} - ${errorText}`);
            }
            await loadData();
            setError(null);
        } catch (error) {
            console.error("Error deleting transaction:", error);
            setError(error.message);
            throw error;
        }
    };

    return { transactions, summary, isLoading, error, loadData, deleteTransaction };
};