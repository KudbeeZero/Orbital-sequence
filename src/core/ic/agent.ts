import { HttpAgent } from '@dfinity/agent';
import type { Identity } from '@dfinity/agent';

const LOCAL_HOST = 'http://127.0.0.1:4943';
const IC_HOST    = 'https://icp0.io';

/** Creates an HttpAgent for the given identity.
 *  Automatically fetches the root key on local networks. */
export async function createAgent(identity: Identity): Promise<HttpAgent> {
  const isLocal = process.env.DFX_NETWORK !== 'ic';

  const agent = new HttpAgent({
    identity,
    host: isLocal ? LOCAL_HOST : IC_HOST,
  });

  if (isLocal) {
    // Needed for local replica — skipped on mainnet
    await agent.fetchRootKey().catch(console.error);
  }

  return agent;
}
