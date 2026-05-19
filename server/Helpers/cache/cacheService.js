import { createClient } from 'redis';
import NodeCache from 'node-cache';

class CacheService {
    constructor() {
        this.redisClient = null;
        this.localCache = new NodeCache({ stdTTL: process.env.CACHE_TTL || 3600, checkperiod: 600 });
        this.isRedisConnected = false;
        this.redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    }

    async connect() {
        try {
            this.redisClient = createClient({
                url: this.redisUrl,
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 10) {
                            console.warn('[Cache] Redis reconnection failed after 10 attempts. Using local cache.');
                            this.isRedisConnected = false;
                            return false; // stop retrying
                        }
                        return Math.min(retries * 100, 3000);
                    }
                }
            });

            this.redisClient.on('error', (err) => {
                console.error('[Cache] Redis Error:', err.message);
                this.isRedisConnected = false;
            });

            this.redisClient.on('connect', () => {
                console.log('[Cache] Redis connected successfully');
                this.isRedisConnected = true;
            });

            await this.redisClient.connect();
        } catch (error) {
            console.error('[Cache] Redis connection failed. Falling back to local cache.', error.message);
            this.isRedisConnected = false;
        }
    }

    async get(key) {
        try {
            if (this.isRedisConnected) {
                const data = await this.redisClient.get(key);
                return data ? JSON.parse(data) : null;
            }
        } catch (error) {
            console.error(`[Cache] Redis get error for key ${key}:`, error.message);
        }

        // Fallback to local cache
        const localData = this.localCache.get(key);
        return localData || null;
    }

    async set(key, value, ttl = process.env.CACHE_TTL || 3600) {
        const stringValue = JSON.stringify(value);
        
        // Always set local cache
        this.localCache.set(key, value, ttl);

        try {
            if (this.isRedisConnected) {
                await this.redisClient.set(key, stringValue, {
                    EX: parseInt(ttl)
                });
            }
        } catch (error) {
            console.error(`[Cache] Redis set error for key ${key}:`, error.message);
        }
    }

    async del(key) {
        this.localCache.del(key);
        try {
            if (this.isRedisConnected) {
                await this.redisClient.del(key);
            }
        } catch (error) {
            console.error(`[Cache] Redis del error for key ${key}:`, error.message);
        }
    }

    /**
     * Delete keys matching a pattern (e.g. "items:*")
     * Note: In production Redis, this should use SCAN instead of KEYS
     */
    async delByPattern(pattern) {
        // Local cache doesn't support glob deletion natively, so we filter keys
        const keys = this.localCache.keys().filter(k => k.startsWith(pattern.replace('*', '')));
        keys.forEach(k => this.localCache.del(k));

        try {
            if (this.isRedisConnected) {
                // Get keys matching pattern (using KEYS for simplicity here, SCAN is better for huge datasets)
                const redisKeys = await this.redisClient.keys(pattern);
                if (redisKeys.length > 0) {
                    await this.redisClient.del(redisKeys);
                }
            }
        } catch (error) {
            console.error(`[Cache] Redis delByPattern error for ${pattern}:`, error.message);
        }
    }

    async flush() {
        this.localCache.flushAll();
        if (this.isRedisConnected) {
            await this.redisClient.flushAll();
        }
    }
}

// Singleton instance
const cacheService = new CacheService();
export default cacheService;
