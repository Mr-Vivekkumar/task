import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

// Create Redis connection using REDIS_URL environment variable
const createRedisConnection = (): Redis => {
  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    console.warn('REDIS_URL not found in environment variables. Using default Redis connection.');
    return new Redis({
      host: 'localhost',
      port: 6379,
      retryStrategy: () => 100, // retry after 100ms
      maxRetriesPerRequest: 3,
    });
  }

  try {
    return new Redis(redisUrl, {
      retryStrategy: () => 100, // retry after 100ms
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  } catch (error) {
    console.error('Failed to create Redis connection:', error);
    throw new Error('Redis connection failed');
  }
};

export const redis = globalForRedis.redis ?? createRedisConnection();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

// Redis connection event handlers
redis.on('connect', () => {
  console.log('Redis connected successfully');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('close', () => {
  console.log('Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('Redis reconnecting...');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing Redis connection...');
  await redis.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing Redis connection...');
  await redis.quit();
  process.exit(0);
});

export default redis;
