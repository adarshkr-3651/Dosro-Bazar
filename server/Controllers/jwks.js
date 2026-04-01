// ========================================
// JWKS CONTROLLER
// Provides public keys in JWKS format for token verification
// ========================================

import keyManager from '../Helpers/auth/keyManager.js';

/**
 * Get JWKS (JSON Web Key Set)
 * Public endpoint for clients to discover public keys
 */
const getJWKS = (req, res) => {
    // console.log("[jwks.js] getJWKS() - Serving JWKS endpoint");

    try {
        const jwks = keyManager.getJWKS();

        // Set cache control headers (cache for 1 hour)
        res.set('Cache-Control', 'public, max-age=3600');
        res.set('Content-Type', 'application/json');

        return res.status(200).json(jwks);
    } catch (error) {
        console.error("[jwks.js] Error serving JWKS:", error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export {
    getJWKS
};

