import Redis from 'ioredis'
import dotenv from "dotenv";
dotenv.config();
const redis = new Redis(process.env.Redis_URL);



redis.on('connect', () => {
    console.log('Connected to Redis');
});
redis.on('error', (err) => {
    console.log('Redis connection error:', err);
});

export default redis;