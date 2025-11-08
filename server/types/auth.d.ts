/**
 * Server-side type declarations for nuxt-auth-utils
 * Extends the default session types with our custom user data
 */

import type { User as AppUser } from '~/types/auth';

declare module '#auth-utils' {
  // Use our existing User type from the app
  interface User extends AppUser {}

  interface UserSession {
    // Extended session data
    access_token: string;
    token_type: string;
    expires_in: number;
    expiresAt: number; // Timestamp when the access token expires
  }

  interface SecureSessionData {
    // Add any sensitive data that should be encrypted
  }
}

export {};
