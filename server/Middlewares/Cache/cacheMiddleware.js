import cacheService from '../../Helpers/cache/cacheService.js';

/**
 * Middleware to cache successful JSON responses.
 * @param {number} ttl - Time to live in seconds.
 */
const cacheMiddleware = (ttl = process.env.CACHE_TTL || 3600) => {
    return async (req, res, next) => {
        // Skip caching if not GET request or if bypass-cache header is present
        if (req.method !== 'GET' || req.headers['x-bypass-cache']) {
            return next();
        }

        // Generate cache key based on URL and query params
        // Prefix with 'items' if it's an item-related route to make invalidation easier
        const prefix = req.originalUrl.includes('/item') ? 'item:' : 'cache:';
        const key = `${prefix}${req.originalUrl}`;

        try {
            const cachedData = await cacheService.get(key);

            if (cachedData) {
                // console.log(`[Cache] HIT: ${key}`);
                // Set headers to indicate a cache hit
                res.setHeader('X-Cache', 'HIT');
                res.setHeader('Cache-Control', `public, max-age=${ttl}`);
                return res.status(200).json(cachedData);
            }

            // console.log(`[Cache] MISS: ${key}`);
            res.setHeader('X-Cache', 'MISS');

            // Monkey-patch res.json to capture the response and store it in cache
            const originalJson = res.json;
            res.json = function (data) {
                // Only cache successful responses (status 200)
                if (res.statusCode === 200 && data.success !== false) {
                    cacheService.set(key, data, ttl);
                }
                
                // Set Cache-Control for the browser even on MISS
                res.setHeader('Cache-Control', `public, max-age=${ttl}`);
                
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            console.error('[Cache Middleware] Error:', error.message);
            next(); // Proceed without caching on error
        }
    };
};

export default cacheMiddleware;
