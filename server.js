import express from 'express';
import { createClient } from 'redis';
import { readFile } from 'fs/promises';

const app = express();
const port = 9000;

// Read products from the JSON file
const fetchFromDatabase = async () => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const data = JSON.parse(await readFile(new URL('./products.json', import.meta.url)));
            resolve(data);
        }, 1000); // Simulate 1-second delay
    });
};

// Setup Redis client
const redisClient = createClient();

(async () => {
    try {
        await redisClient.connect(); // Connect to Redis
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Redis connection error:', error);
    }
})();

// GET /data endpoint
app.get('/data', async (req, res) => {
    const cacheKey = 'product_data';

    try {
        // Check if data is in Redis cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Cache hit');
            return res.json(JSON.parse(cachedData));
        }

        // Cache miss: Fetch from "database"
        console.log('Cache miss');
        const data = await fetchFromDatabase();

        // Cache the data in Redis for 10 minutes (600 seconds)
        await redisClient.setEx(cacheKey, 600, JSON.stringify(data));

        res.json(data);
    } catch (error) {
        console.error('Error:', error);

        // Fallback to fetch fresh data if Redis fails
        const data = await fetchFromDatabase();
        res.json(data);
    }
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await redisClient.quit(); // Close Redis connection
    process.exit(0);
});

// Start the server
app.listen(port, () => {
    console.log(`Mock API server running at http://localhost:${port}`);
});
