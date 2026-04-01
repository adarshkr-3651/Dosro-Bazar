// ========================================
// RSA KEY MANAGER
// Loads and manages RSA keys for JWT operations
// ========================================

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// console.log("Key Manager module loaded");

class KeyManager {
    constructor() {
        this.privateKey = null;
        this.publicKey = null;
        this.keyId = null;
        this.loadKeys();
    }

    /**
     * Load RSA keys from filesystem
     */
    loadKeys() {
        try {
            const keysDir = path.join(__dirname, '../../keys');

            // Load private key
            const privateKeyPath = path.join(keysDir, 'private.key');
            this.privateKey = fs.readFileSync(privateKeyPath, 'utf8');

            // Load public key
            const publicKeyPath = path.join(keysDir, 'public.key');
            this.publicKey = fs.readFileSync(publicKeyPath, 'utf8');

            // Generate key ID (fingerprint of public key)
            this.keyId = this.generateKeyId(this.publicKey);

        } catch (error) {
            console.error('❌ Failed to load RSA keys:', error.message);
            console.error('Please run: node keys/generateKeys.js');
            throw new Error('RSA keys not found. Please generate keys first.');
        }
    }

    /**
     * Generate a unique key ID from public key
     */
    generateKeyId(publicKey) {
        const hash = crypto.createHash('sha256');
        hash.update(publicKey);
        return hash.digest('hex').substring(0, 16);
    }

    /**
     * Get private key for signing
     */
    getPrivateKey() {
        return this.privateKey;
    }

    /**
     * Get public key for verification
     */
    getPublicKey() {
        return this.publicKey;
    }

    /**
     * Get key ID
     */
    getKeyId() {
        return this.keyId;
    }

    /**
     * Generate JWKS (JSON Web Key Set) format
     * Used for public key discovery
     */
    getJWKS() {
        // Extract modulus and exponent from public key
        const publicKeyObject = crypto.createPublicKey(this.publicKey);
        const jwk = publicKeyObject.export({ format: 'jwk' });

        return {
            keys: [
                {
                    kty: 'RSA',
                    use: 'sig',
                    alg: 'RS256',
                    kid: this.keyId,
                    n: jwk.n,
                    e: jwk.e
                }
            ]
        };
    }
}

// Create singleton instance
const keyManager = new KeyManager();

export default keyManager;
