import {sql } from "../config/db.js";

export async function getTransactionByUserId(req, res) {
    try {
        const { userId } = req.params;
        const transactions = await sql`
        SELECT *
        FROM transactions
        WHERE user_id = ${userId}
        ORDER BY created_at DESC;
        `;
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error getting the transaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function createTransaction(req, res) {
    try {
        const { user_id, title, amount, category } = req.body;
        if (!user_id || !title || !amount || category === undefined) {
        return res.status(400).json({ error: "All fields are required" });
        }

        const transaction = await sql`
        INSERT INTO transactions (user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *;
        `;

        console.log(transaction);
        res.status(201).json(transaction[0]);
    } catch (error) {
        console.error("Error creating the transaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
        return res.status(200).json({ message: "Invalid transaction ID" });
        }

        const result = await sql`
        DELETE FROM transactions
        WHERE id = ${id}
        RETURNING *;
        `;

        if (result.length === 0) {
        return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting the transaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getSummaryByUserId(req, res) {
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS balance
        FROM transactions
        WHERE user_id = ${userId};
        `;
        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS income
        FROM transactions
        WHERE user_id = ${userId} AND amount > 0;
        `;
        const expensesResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS expenses
        FROM transactions
        WHERE user_id = ${userId} AND amount < 0;
        `;

        res.status(200).json({
        balance: parseFloat(balanceResult[0].balance),
        income: parseFloat(incomeResult[0].income),
        expenses: parseFloat(expensesResult[0].expenses),
        });
    } catch (error) {
        console.error("Error getting the summary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
