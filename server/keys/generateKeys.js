// ========================================
// RSA KEY GENERATOR
// Generates RSA-2048 key pair for JWT signing
// ========================================

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log("Generating RSA key pair...");

// Generate RSA key pair (2048 bits)
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// Ensure keys directory exists
const keysDir = path.join(__dirname);
if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
}

// Write private key
fs.writeFileSync(path.join(keysDir, 'private.key'), privateKey);
console.log('✅ Private key generated: keys/private.key');

// Write public key
fs.writeFileSync(path.join(keysDir, 'public.key'), publicKey);
console.log('✅ Public key generated: keys/public.key');

console.log('\n⚠️  IMPORTANT: Add keys/ to .gitignore to keep private key secure!');
console.log('✅ Key generation complete!');
