import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

function derive(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        scrypt(password, salt, KEY_LENGTH, (err, key) => {
            if (err) reject(err);
            else resolve(key.toString("hex"));
        });
    });
}

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derived = await derive(password, salt);
    return `${salt}:${derived}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;

    const derived = Buffer.from(await derive(password, salt), "hex");
    const expected = Buffer.from(hash, "hex");

    return derived.length === expected.length && timingSafeEqual(derived, expected);
}
