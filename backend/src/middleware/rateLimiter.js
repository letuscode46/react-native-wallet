
import rateLimit from "../config/upstash.js";

const rateLimiter  = async (req, res, next) => {
    try {
        // Check the rate limit for the user, keep it simple
        // in a real world, we need to identify the user, e.g. by IP address or user ID
        const { success } = await rateLimit.limit("my-rate-limit")

        if (!success) {
            return res.status(429).json({
                message: "Too many requests. Please try again later.",
            });
        }

        // If the request is within the limit, proceed to the next middleware
        next();


    } catch (error) {
        console.error("Rate limiter error:", error);
        next(error); // Pass the error to the next middleware
    }
};

export default rateLimiter;