import { exportSPKI, importJWK } from 'jose';
import fetch from 'node-fetch';
async function getClerkJWTKey() {
    const jwksUrl = 'https://nice-badger-70.clerk.accounts.dev/.well-known/jwks.json'; // Replace with your JWKS URL
    const res = await fetch(jwksUrl);
    // ✅ Cast JSON to JWKS type
    const jwks = await res.json();
    if (!jwks.keys || jwks.keys.length === 0) {
        throw new Error("No keys found in JWKS");
    }
    const jwk = jwks.keys[0]; // Use the first key
    const publicKey = await importJWK(jwk, 'RS256');
    const pem = await exportSPKI(publicKey);
    console.log(pem.trim());
}
getClerkJWTKey().catch(console.error);
