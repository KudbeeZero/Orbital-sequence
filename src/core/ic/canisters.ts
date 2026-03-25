/**
 * Actor factories for each ICP canister.
 * Uses manually typed interfaces until `dfx generate` creates src/declarations/.
 */

import { Actor, HttpAgent } from '@dfinity/agent';
import type { Principal } from '@dfinity/principal';
import type {
  PlotMetadata,
  AvatarTier,
  CommanderAvatar,
  Battle,
  AiFaction,
} from './types';

// ─── Canister IDs ────────────────────────────────────────────────────────────

function canisterId(name: string): string {
  const id = process.env[`CANISTER_ID_${name.toUpperCase()}`];
  if (!id) throw new Error(`Canister ID not set for ${name}. Did you run dfx deploy?`);
  return id;
}

// ─── LandNFT Actor ───────────────────────────────────────────────────────────

const landNftIdl = ({ IDL }: { IDL: any }) => {
  const Biome = IDL.Variant({
    Forest: IDL.Null, Desert: IDL.Null, Mountain: IDL.Null, Plains: IDL.Null,
    Water: IDL.Null,  Tundra: IDL.Null, Volcanic: IDL.Null, Swamp: IDL.Null,
  });
  const PlotMetadata = IDL.Record({
    tokenId: IDL.Nat, biome: Biome,
    lat: IDL.Int, lon: IDL.Int,
    ironYield: IDL.Nat, fuelYield: IDL.Nat, crystalYield: IDL.Nat,
  });
  const TransferArgs = IDL.Record({ from: IDL.Principal, to: IDL.Principal, tokenId: IDL.Nat });
  const TransferResult = IDL.Variant({ Ok: IDL.Nat, Err: IDL.Text });
  return IDL.Service({
    init_plots:           IDL.Func([], [IDL.Text], []),
    purchase_plot:        IDL.Func([IDL.Nat, IDL.Principal], [TransferResult], []),
    icrc7_owner_of:       IDL.Func([IDL.Nat], [IDL.Opt(IDL.Principal)], ['query']),
    icrc7_balance_of:     IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    icrc7_transfer:       IDL.Func([TransferArgs], [TransferResult], []),
    icrc7_token_metadata: IDL.Func([IDL.Nat], [IDL.Opt(PlotMetadata)], ['query']),
    icrc7_total_supply:   IDL.Func([], [IDL.Nat], ['query']),
    icrc7_name:           IDL.Func([], [IDL.Text], ['query']),
    icrc7_symbol:         IDL.Func([], [IDL.Text], ['query']),
    get_tokens_of:        IDL.Func([IDL.Principal], [IDL.Vec(IDL.Nat)], ['query']),
    get_plots_range:      IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(PlotMetadata)], ['query']),
  });
};

export interface LandNftActor {
  init_plots:           () => Promise<string>;
  purchase_plot:        (tokenId: bigint, buyer: Principal) => Promise<{ Ok: bigint } | { Err: string }>;
  icrc7_owner_of:       (tokenId: bigint) => Promise<[] | [Principal]>;
  icrc7_balance_of:     (owner: Principal) => Promise<bigint>;
  icrc7_transfer:       (args: { from: Principal; to: Principal; tokenId: bigint }) => Promise<{ Ok: bigint } | { Err: string }>;
  icrc7_token_metadata: (tokenId: bigint) => Promise<[] | [PlotMetadata]>;
  icrc7_total_supply:   () => Promise<bigint>;
  icrc7_name:           () => Promise<string>;
  icrc7_symbol:         () => Promise<string>;
  get_tokens_of:        (owner: Principal) => Promise<bigint[]>;
  get_plots_range:      (start: bigint, count: bigint) => Promise<PlotMetadata[]>;
}

export function createLandNftActor(agent: HttpAgent): LandNftActor {
  return Actor.createActor(landNftIdl, {
    agent,
    canisterId: canisterId('LAND_NFT'),
  }) as LandNftActor;
}

// ─── FrontierToken Actor ─────────────────────────────────────────────────────

const frontierTokenIdl = ({ IDL }: { IDL: any }) => {
  const Account = IDL.Record({ owner: IDL.Principal, subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)) });
  const TransferArgs = IDL.Record({
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    to: Account, amount: IDL.Nat, fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)), created_at_time: IDL.Opt(IDL.Nat64),
  });
  const TransferError = IDL.Variant({
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
    TooOld: IDL.Null, TemporarilyUnavailable: IDL.Null,
    GenericError: IDL.Record({ error_code: IDL.Nat, message: IDL.Text }),
  });
  const TransferResult = IDL.Variant({ Ok: IDL.Nat, Err: TransferError });
  const MintBurnResult = IDL.Variant({ Ok: IDL.Nat, Err: IDL.Text });
  return IDL.Service({
    icrc1_name:           IDL.Func([], [IDL.Text], ['query']),
    icrc1_symbol:         IDL.Func([], [IDL.Text], ['query']),
    icrc1_decimals:       IDL.Func([], [IDL.Nat8], ['query']),
    icrc1_fee:            IDL.Func([], [IDL.Nat], ['query']),
    icrc1_total_supply:   IDL.Func([], [IDL.Nat], ['query']),
    icrc1_balance_of:     IDL.Func([Account], [IDL.Nat], ['query']),
    icrc1_transfer:       IDL.Func([TransferArgs], [TransferResult], []),
    mint:                 IDL.Func([IDL.Principal, IDL.Nat], [MintBurnResult], []),
    burn:                 IDL.Func([IDL.Principal, IDL.Nat], [MintBurnResult], []),
  });
};

export interface FrontierTokenActor {
  icrc1_name:         () => Promise<string>;
  icrc1_symbol:       () => Promise<string>;
  icrc1_decimals:     () => Promise<number>;
  icrc1_fee:          () => Promise<bigint>;
  icrc1_total_supply: () => Promise<bigint>;
  icrc1_balance_of:   (account: { owner: Principal; subaccount: [] }) => Promise<bigint>;
  icrc1_transfer:     (args: any) => Promise<{ Ok: bigint } | { Err: any }>;
}

export function createFrontierTokenActor(agent: HttpAgent): FrontierTokenActor {
  return Actor.createActor(frontierTokenIdl, {
    agent,
    canisterId: canisterId('FRONTIER_TOKEN'),
  }) as FrontierTokenActor;
}

// ─── GameState Actor ──────────────────────────────────────────────────────────

const gameStateIdl = ({ IDL }: { IDL: any }) => {
  const AvatarTier = IDL.Variant({ Sentinel: IDL.Null, Phantom: IDL.Null, Reaper: IDL.Null });
  const BattleStatus = IDL.Variant({ Pending: IDL.Null, Active: IDL.Null, Resolved: IDL.Null });
  const CommanderAvatar = IDL.Record({
    owner: IDL.Principal, tier: AvatarTier,
    mintedAt: IDL.Int, combatBonus: IDL.Nat,
  });
  const Battle = IDL.Record({
    id: IDL.Nat, attacker: IDL.Principal, defender: IDL.Principal,
    plotId: IDL.Nat, startTime: IDL.Int, status: BattleStatus,
    winner: IDL.Opt(IDL.Principal),
  });
  const AiFaction = IDL.Record({ name: IDL.Text, color: IDL.Text, plotIds: IDL.Vec(IDL.Nat) });
  const OkNatErr  = IDL.Variant({ Ok: IDL.Nat,  Err: IDL.Text });
  const OkTextErr = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
  return IDL.Service({
    init:                IDL.Func([IDL.Principal, IDL.Principal], [], []),
    init_ai_factions:    IDL.Func([], [IDL.Text], []),
    harvest:             IDL.Func([IDL.Nat], [OkNatErr], []),
    initiate_battle:     IDL.Func([IDL.Nat], [OkNatErr], []),
    resolve_battle:      IDL.Func([IDL.Nat], [OkTextErr], []),
    mint_avatar:         IDL.Func([AvatarTier], [OkTextErr], []),
    get_avatar:          IDL.Func([IDL.Principal], [IDL.Opt(CommanderAvatar)], ['query']),
    get_battle:          IDL.Func([IDL.Nat], [IDL.Opt(Battle)], ['query']),
    get_harvest_cooldown:IDL.Func([IDL.Nat], [IDL.Int], ['query']),
    get_ai_factions:     IDL.Func([], [IDL.Vec(AiFaction)], ['query']),
  });
};

export interface GameStateActor {
  harvest:              (plotId: bigint) => Promise<{ Ok: bigint } | { Err: string }>;
  initiate_battle:      (plotId: bigint) => Promise<{ Ok: bigint } | { Err: string }>;
  resolve_battle:       (battleId: bigint) => Promise<{ Ok: string } | { Err: string }>;
  mint_avatar:          (tier: AvatarTier) => Promise<{ Ok: string } | { Err: string }>;
  get_avatar:           (player: Principal) => Promise<[] | [CommanderAvatar]>;
  get_battle:           (battleId: bigint) => Promise<[] | [Battle]>;
  get_harvest_cooldown: (plotId: bigint) => Promise<bigint>;
  get_ai_factions:      () => Promise<AiFaction[]>;
}

export function createGameStateActor(agent: HttpAgent): GameStateActor {
  return Actor.createActor(gameStateIdl, {
    agent,
    canisterId: canisterId('GAME_STATE'),
  }) as GameStateActor;
}
