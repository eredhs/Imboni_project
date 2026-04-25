import crypto from "crypto";
import { ApiKey } from "../models/api-key.model.js";
import bcryptjs from "bcryptjs";

const API_KEY_PREFIX = "imb_";
const API_KEY_LENGTH = 32;

/**
 * Generate a new permanent API key for HR user
 */
export async function generateApiKey(
  hrId: string,
  name: string,
  expiresAt?: Date
) {
  // Generate random key
  const rawKey = `${API_KEY_PREFIX}${crypto.randomBytes(API_KEY_LENGTH).toString("hex")}`;
  const prefix = rawKey.substring(0, 8);

  // Hash the key for storage
  const hashedKey = await bcryptjs.hash(rawKey, 12);

  // Store in database
  const apiKey = await ApiKey.create({
    hrId,
    name,
    key: hashedKey,
    prefix,
    expiresAt,
    isActive: true,
  });

  // Return raw key only once (not stored in DB)
  return {
    id: apiKey._id,
    key: rawKey,
    prefix,
    name,
    createdAt: apiKey.createdAt,
    expiresAt: apiKey.expiresAt,
  };
}

/**
 * Verify if API key is valid
 */
export async function verifyApiKey(rawKey: string) {
  const apiKey = await ApiKey.findOne({
    prefix: rawKey.substring(0, 8),
    isActive: true,
  });

  if (!apiKey) {
    return null;
  }

  // Check expiration
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    return null;
  }

  // Verify hashed key
  const isValid = await bcryptjs.compare(rawKey, apiKey.key);

  if (isValid) {
    // Update last used timestamp
    await ApiKey.updateOne({ _id: apiKey._id }, { lastUsed: new Date() });
    return apiKey;
  }

  return null;
}

/**
 * List all API keys for an HR user
 */
export async function listApiKeys(hrId: string) {
  const keys = await ApiKey.find({ hrId }).select(
    "name prefix isActive createdAt lastUsed expiresAt"
  );

  return keys.map((key) => ({
    id: key._id,
    name: key.name,
    prefix: key.prefix,
    isActive: key.isActive,
    createdAt: key.createdAt,
    lastUsed: key.lastUsed,
    expiresAt: key.expiresAt,
  }));
}

/**
 * Revoke/deactivate an API key
 */
export async function revokeApiKey(keyId: string, hrId: string) {
  const apiKey = await ApiKey.findOneAndUpdate(
    { _id: keyId, hrId },
    { isActive: false },
    { new: true }
  );

  if (!apiKey) {
    throw new Error("API key not found");
  }

  return apiKey;
}

/**
 * Delete an API key permanently
 */
export async function deleteApiKey(keyId: string, hrId: string) {
  const result = await ApiKey.deleteOne({ _id: keyId, hrId });

  if (result.deletedCount === 0) {
    throw new Error("API key not found");
  }

  return { success: true };
}
