import { z } from "zod";

export const apiKeySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  secret: z.string().min(1),
  created: z.string().min(1),
  revoked: z.boolean(),
});

export type ApiKey = z.infer<typeof apiKeySchema>;

export const apiKeysSchema = z.array(apiKeySchema);

export function maskApiKey(secret: string): string {
  if (secret.length <= 12) return secret;
  return `${secret.slice(0, 8)}••••••••••••${secret.slice(-4)}`;
}

function randomHex(length: number): string {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);
}

export function generateApiSecret(): string {
  return `gl_${randomHex(24)}`;
}

export function generateApiKeyId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `key-${crypto.randomUUID()}`;
  }
  return `key-${Date.now().toString(36)}`;
}
