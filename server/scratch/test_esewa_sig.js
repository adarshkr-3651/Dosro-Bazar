import crypto from 'crypto';

const secretKey = "8gBm/:&EnhH.1/q";
const total_amount = "110";
const transaction_uuid = "241028";
const product_code = "EPAYTEST";

const signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

const hash = crypto.createHmac('sha256', secretKey)
    .update(signatureString)
    .digest('base64');

console.log("Message String:", signatureString);
console.log("Generated Signature:", hash);
console.log("Expected Signature:  i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=");
console.log("Match:", hash === "i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=");
