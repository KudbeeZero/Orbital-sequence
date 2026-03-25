import { AuthClient } from '@dfinity/auth-client';
import type { Identity } from '@dfinity/agent';

const II_URL =
  process.env.DFX_NETWORK === 'ic'
    ? 'https://identity.ic0.app'
    : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;

let _authClient: AuthClient | null = null;

async function getClient(): Promise<AuthClient> {
  if (!_authClient) {
    _authClient = await AuthClient.create({
      idleOptions: { disableIdle: true },
    });
  }
  return _authClient;
}

/** Returns true if the user has an active authenticated session. */
export async function isAuthenticated(): Promise<boolean> {
  const client = await getClient();
  return client.isAuthenticated();
}

/** Returns the current identity (anonymous if not logged in). */
export async function getIdentity(): Promise<Identity> {
  const client = await getClient();
  return client.getIdentity();
}

/** Opens the Internet Identity window and resolves when login completes. */
export async function login(): Promise<boolean> {
  const client = await getClient();
  return new Promise((resolve) => {
    client.login({
      identityProvider: II_URL,
      maxTimeToLive: BigInt(7 * 24 * 3600 * 1_000_000_000), // 7 days in nanoseconds
      onSuccess: () => resolve(true),
      onError:   () => resolve(false),
    });
  });
}

/** Logs the user out and clears the local session. */
export async function logout(): Promise<void> {
  const client = await getClient();
  await client.logout();
  _authClient = null;
}
