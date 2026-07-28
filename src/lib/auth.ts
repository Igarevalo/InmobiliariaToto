import crypto from "crypto";

// Secret key for HMAC signature. In production, this should be set in process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "default_super_secure_key_for_toto_inmobiliaria_change_me_in_prod";

/**
 * Hash a password using Node's native scrypt algorithm.
 * Returns a string formatted as "salt:hash".
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored hash.
 * If the stored hash is not in "salt:hash" format, it falls back to plaintext comparison
 * to support the initial/env password securely.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  // Backwards compatibility/fallback for plaintext password configured in env or old config
  if (!storedHash.includes(":")) {
    return password === storedHash;
  }

  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const verifyHash = crypto.scryptSync(password, salt, 64).toString("hex");
  
  // Timing safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(verifyHash, "hex")
  );
}

/**
 * Generate a signed session token.
 * Contains a payload with role, expiration, optional user details, and an HMAC signature.
 */
export function generateSessionToken(expiresInSeconds: number, userDetails?: { name: string; email: string; username: string; avatar?: string }): string {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  const payload = JSON.stringify({ role: "admin", expiresAt, user: userDetails });
  
  const payloadBase64 = Buffer.from(payload).toString("base64");
  const hmac = crypto.createHmac("sha256", JWT_SECRET);
  hmac.update(payloadBase64);
  const signature = hmac.digest("hex");
  
  return `${payloadBase64}.${signature}`;
}

/**
 * Verify a session token.
 * Validates the HMAC signature and checks if the token has expired.
 */
export function verifySessionToken(token: string | undefined): boolean {
  return getSessionPayload(token) !== null;
}

/**
 * Extract and verify session payload.
 * Returns the decoded payload if valid, otherwise null.
 */
export function getSessionPayload(token: string | undefined): any | null {
  if (!token) return null;
  
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  
  const [payloadBase64, signature] = parts;
  
  try {
    // Verify signature first
    const hmac = crypto.createHmac("sha256", JWT_SECRET);
    hmac.update(payloadBase64);
    const expectedSignature = hmac.digest("hex");
    
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
    
    if (!isSignatureValid) return null;

    // Decode and parse payload
    const payloadStr = Buffer.from(payloadBase64, "base64").toString("utf8");
    const payload = JSON.parse(payloadStr);
    
    // Check role and expiration
    if (payload.role !== "admin") return null;
    if (!payload.expiresAt || payload.expiresAt < Date.now()) return null;
    
    return payload;
  } catch (e) {
    return null;
  }
}
