/**
 * icStore — Zustand store for ICP Internet Identity auth state.
 * Manages login/logout and exposes the IC agent + canister actors.
 */

import { create } from 'zustand';
import type { Identity, HttpAgent } from '@dfinity/agent';
import type { Principal } from '@dfinity/principal';
import { isAuthenticated, getIdentity, login as iiLogin, logout as iiLogout } from '../ic/auth';
import { createAgent } from '../ic/agent';
import { createLandNftActor, createFrontierTokenActor, createGameStateActor } from '../ic/canisters';
import type { LandNftActor, FrontierTokenActor, GameStateActor } from '../ic/canisters';

interface IcState {
  isAuthenticated: boolean;
  isLoading: boolean;
  principal: Principal | null;
  identity: Identity | null;
  agent: HttpAgent | null;
  landNft: LandNftActor | null;
  frontierToken: FrontierTokenActor | null;
  gameState: GameStateActor | null;
  /** Call on app mount — restores session if one exists. */
  initAuth: () => Promise<void>;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useIcStore = create<IcState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  principal: null,
  identity: null,
  agent: null,
  landNft: null,
  frontierToken: null,
  gameState: null,

  initAuth: async () => {
    set({ isLoading: true });
    try {
      const authed = await isAuthenticated();
      if (authed) {
        const identity = await getIdentity();
        const agent    = await createAgent(identity);
        set({
          isAuthenticated: true,
          identity,
          principal: identity.getPrincipal(),
          agent,
          landNft:       createLandNftActor(agent),
          frontierToken: createFrontierTokenActor(agent),
          gameState:     createGameStateActor(agent),
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  login: async () => {
    const success = await iiLogin();
    if (success) {
      await get().initAuth();
    }
    return success;
  },

  logout: async () => {
    await iiLogout();
    set({
      isAuthenticated: false,
      principal: null,
      identity: null,
      agent: null,
      landNft: null,
      frontierToken: null,
      gameState: null,
    });
  },
}));
