import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js";

const app = express();

// middleware
app.use(rateLimiter); // Apply rate limiting middleware,
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.use("/api/transactions", transactionsRoute);
// app.use("/api/products", productsRoute); // Assuming you have a productsRoute

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT:", PORT);
    });
});
