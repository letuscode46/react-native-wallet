import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

const app = express();
if (process.env.NODE_ENV === "production") job.start();

// middleware
app.use(rateLimiter); 
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);
// app.use("/api/products", productsRoute); 

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT:", PORT);
    });
});
