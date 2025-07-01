import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'; // Importing Redis and Ratelimit from Upstash
import "dotenv/config"; // Importing dotenv to load environment variables


const rateLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, "60 s"),

});

export default rateLimit; // Exporting the rateLimiter instance
