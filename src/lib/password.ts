import { scryptSync, timingSafeEqual } from "node:crypto";

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split(":");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const candidate = Buffer.from(scryptSync(password, salt, 64).toString("hex"));
  const expected = Buffer.from(hash);

  if (candidate.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(candidate, expected);
}
