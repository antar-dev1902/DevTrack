import { demoProfiles } from '../data/profileData.js';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STORAGE_USERS_KEY = 'devtrack_users';
const STORAGE_CREDENTIALS_KEY = 'devtrack_auth_credentials';
const STORAGE_SESSION_KEY = 'devtrack_session';
const STORAGE_CURRENT_USER_KEY = 'devtrack_current_user';
const STORAGE_CURRENT_USER_ID_KEY = 'devtrack_current_user_id';

// In-memory fallback storage for server/test environments without window.localStorage
const memoryStore = new Map();
const memoryStorage = {
  getItem: (key) => (memoryStore.has(key) ? memoryStore.get(key) : null),
  setItem: (key, value) => { memoryStore.set(key, String(value)); },
  removeItem: (key) => { memoryStore.delete(key); },
  clear: () => { memoryStore.clear(); },
};

export function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // Storage access blocked or restricted
  }
  return memoryStorage;
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function uint8ArrayToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToUint8Array(hexString) {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Standard Web Crypto API PBKDF2 with HMAC-SHA-256 and 100,000 iterations.
 * Generates or uses a 16-byte random salt.
 */
export async function hashPassword(password, saltHex = null) {
  const encoder = new TextEncoder();
  const subtle = globalThis.crypto?.subtle;

  if (!subtle) {
    throw new Error('Web Crypto API is not available in this environment.');
  }

  let saltBytes;
  if (saltHex) {
    saltBytes = hexToUint8Array(saltHex);
  } else {
    saltBytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(saltBytes);
  }

  const keyMaterial = await subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );

  const derivedBits = await subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  );

  return {
    salt: uint8ArrayToHex(saltBytes),
    hash: uint8ArrayToHex(new Uint8Array(derivedBits)),
  };
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function readJson(storage, key, fallback = null) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Fail silently when storage is full or restricted
  }
}

export function getStoredUsers(storage = getStorage()) {
  const users = readJson(storage, STORAGE_USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

export function getStoredCredentials(storage = getStorage()) {
  const creds = readJson(storage, STORAGE_CREDENTIALS_KEY, []);
  return Array.isArray(creds) ? creds : [];
}

/**
 * Checks if a backend authentication provider API is configured via environment variables.
 */
function getBackendApiUrl() {
  try {
    return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AUTH_API_URL) || null;
  } catch {
    return null;
  }
}

/**
 * Register a new user account with genuine password verification.
 */
export async function registerUser({ name, email, password, confirmPassword }, storage = getStorage()) {
  const errors = {};
  const trimmedName = String(name || '').trim();
  const normalizedEmail = normalizeEmail(email);

  if (!trimmedName) {
    errors.name = 'Full name is required.';
  }

  if (!normalizedEmail) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(normalizedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password || password.length === 0) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (confirmPassword !== undefined) {
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const backendUrl = getBackendApiUrl();
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, email: normalizedEmail, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, errors: { form: data.message || 'Registration failed.' } };
      }
      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      return { success: false, errors: { form: `Backend connection error: ${err.message}` } };
    }
  }

  // Standalone client-side mode: verify and store with standard Web Crypto PBKDF2
  const credentials = getStoredCredentials(storage);
  const existingCred = credentials.find((c) => normalizeEmail(c.email) === normalizedEmail);
  if (existingCred) {
    return {
      success: false,
      errors: { email: 'An account with this email address already exists. Please log in instead.' },
    };
  }

  // Check if there is an existing unverified profile in devtrack_users or demoProfiles
  const users = getStoredUsers(storage);
  const existingProfileIndex = users.findIndex((u) => normalizeEmail(u.email) === normalizedEmail);
  const demoProfile = demoProfiles.find((d) => normalizeEmail(d.email) === normalizedEmail);

  let userId;
  let userProfile;

  if (existingProfileIndex >= 0) {
    // Upgrade existing unverified profile without losing progress
    userProfile = {
      ...users[existingProfileIndex],
      name: trimmedName || users[existingProfileIndex].name,
    };
    userId = userProfile.id;
    users[existingProfileIndex] = userProfile;
  } else if (demoProfile) {
    userId = demoProfile.id;
    userProfile = {
      ...demoProfile,
      name: trimmedName || demoProfile.name,
    };
    users.push(userProfile);
  } else {
    userId = `u-${Date.now()}`;
    const initials = trimmedName.charAt(0).toUpperCase() || 'U';
    userProfile = {
      id: userId,
      email: normalizedEmail,
      name: trimmedName,
      developerPath: 'Frontend Developer',
      bio: `${trimmedName}’s developer journey — learning and building on DevTrack.`,
      avatarInitials: initials,
      skills: ['React', 'JavaScript', 'HTML', 'CSS'],
      hackathonsCount: 0,
      github: 'https://github.com/',
      linkedin: 'https://linkedin.com/',
    };
    users.push(userProfile);
  }

  // Hash password using standard PBKDF2 with 16-byte random salt
  const { salt, hash } = await hashPassword(password);

  // Store credentials in isolated storage (NEVER in userProfile or devtrack_users)
  credentials.push({
    userId,
    email: normalizedEmail,
    salt,
    hash,
    createdAt: new Date().toISOString(),
  });

  writeJson(storage, STORAGE_CREDENTIALS_KEY, credentials);
  writeJson(storage, STORAGE_USERS_KEY, users);

  // Create session
  const session = {
    token: `dt-session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId,
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  };

  writeJson(storage, STORAGE_SESSION_KEY, session);
  writeJson(storage, STORAGE_CURRENT_USER_KEY, userProfile);
  try {
    storage.setItem(STORAGE_CURRENT_USER_ID_KEY, userId);
  } catch {
    // ignore
  }

  return { success: true, user: userProfile, session };
}

/**
 * Authenticates user credentials with genuine verification.
 * Rejects unknown emails, incorrect passwords, and unverified demo accounts.
 */
export async function loginUser({ email, password }, storage = getStorage()) {
  const errors = {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(normalizedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password || password.length === 0) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const backendUrl = getBackendApiUrl();
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, errors: { form: data.message || 'Login failed.' } };
      }
      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      return { success: false, errors: { form: `Backend connection error: ${err.message}` } };
    }
  }

  // Standalone client-side mode
  const credentials = getStoredCredentials(storage);
  const accountCred = credentials.find((c) => normalizeEmail(c.email) === normalizedEmail);

  if (!accountCred) {
    // Check if email exists in legacy devtrack_users or demoProfiles without credentials
    const users = getStoredUsers(storage);
    const hasUnverifiedUser = users.some((u) => normalizeEmail(u.email) === normalizedEmail);
    const hasDemo = demoProfiles.some((d) => normalizeEmail(d.email) === normalizedEmail);

    if (hasUnverifiedUser || hasDemo) {
      return {
        success: false,
        errors: {
          form: 'This account does not have verified credentials yet. Please sign up to set your password and activate your account.',
        },
      };
    }

    return {
      success: false,
      errors: {
        form: 'No account found with this email address. Please check your email or sign up.',
      },
    };
  }

  // Verify submitted password against stored salt and PBKDF2 hash
  const { hash: computedHash } = await hashPassword(password, accountCred.salt);
  const isMatch = timingSafeEqual(computedHash, accountCred.hash);

  if (!isMatch) {
    return {
      success: false,
      errors: {
        form: 'Incorrect password. Please try again.',
      },
    };
  }

  // Retrieve user profile
  const users = getStoredUsers(storage);
  let userProfile = users.find((u) => u.id === accountCred.userId || normalizeEmail(u.email) === normalizedEmail);

  if (!userProfile) {
    const demoFound = demoProfiles.find((d) => d.id === accountCred.userId || normalizeEmail(d.email) === normalizedEmail);
    if (demoFound) {
      userProfile = { ...demoFound };
    } else {
      const rawName = normalizedEmail.split('@')[0];
      const formattedName = rawName
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      userProfile = {
        id: accountCred.userId || `u-${Date.now()}`,
        email: normalizedEmail,
        name: formattedName,
        developerPath: 'Frontend Developer',
        bio: 'Learning and building projects on DevTrack.',
        avatarInitials: formattedName.charAt(0) || 'U',
        skills: ['React', 'JavaScript', 'HTML', 'CSS'],
        hackathonsCount: 0,
        github: 'https://github.com/',
        linkedin: 'https://linkedin.com/',
      };
    }
  }

  // Create session
  const session = {
    token: `dt-session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId: userProfile.id,
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  };

  writeJson(storage, STORAGE_SESSION_KEY, session);
  writeJson(storage, STORAGE_CURRENT_USER_KEY, userProfile);
  try {
    storage.setItem(STORAGE_CURRENT_USER_ID_KEY, userProfile.id);
  } catch {
    // ignore
  }

  return { success: true, user: userProfile, session };
}

/**
 * Returns current authenticated user if valid session exists.
 */
export function getCurrentUser(storage = getStorage()) {
  const session = readJson(storage, STORAGE_SESSION_KEY, null);
  if (!session || !session.userId) {
    return null;
  }
  const currentUser = readJson(storage, STORAGE_CURRENT_USER_KEY, null);
  return currentUser;
}

/**
 * Logs out user by clearing session and currentUser keys.
 */
export function logoutUser(storage = getStorage()) {
  try {
    storage.removeItem(STORAGE_SESSION_KEY);
    storage.removeItem(STORAGE_CURRENT_USER_KEY);
    storage.removeItem(STORAGE_CURRENT_USER_ID_KEY);
  } catch {
    // ignore
  }
}
