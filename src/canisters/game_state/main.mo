/**
 * GameState — Core game logic canister for Zero Colony.
 *
 * Handles:
 * - Resource harvesting from owned land plots
 * - PvP battle initiation and resolution
 * - Commander Avatar minting (burn FRNTR)
 * - AI faction territory management
 * Cross-canister calls to land_nft and frontier_token.
 */

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat64 "mo:base/Nat64";

actor GameState {

  // ─── Types ───────────────────────────────────────────────────────────────

  public type AvatarTier = { #Sentinel; #Phantom; #Reaper };

  public type CommanderAvatar = {
    owner     : Principal;
    tier      : AvatarTier;
    mintedAt  : Int;
    combatBonus : Nat; // percentage bonus (5, 15, 30)
  };

  public type BattleStatus = { #Pending; #Active; #Resolved };

  public type Battle = {
    id         : Nat;
    attacker   : Principal;
    defender   : Principal;
    plotId     : Nat;
    startTime  : Int;
    status     : BattleStatus;
    winner     : ?Principal;
  };

  public type AiFaction = {
    name       : Text;
    color      : Text; // hex colour for globe display
    plotIds    : [Nat]; // faction-owned plots
  };

  // ─── Canister References (set by admin) ──────────────────────────────────

  stable var landNftCanister      : Principal = Principal.fromText("aaaaa-aa");
  stable var frontierTokenCanister: Principal = Principal.fromText("aaaaa-aa");
  stable var admin                : Principal = Principal.fromText("aaaaa-aa");

  // ─── Stable State ────────────────────────────────────────────────────────

  // last harvest timestamp per plot
  stable var harvestEntries   : [(Nat, Int)] = [];
  // commander avatars per player
  stable var avatarEntries    : [(Principal, CommanderAvatar)] = [];
  // active battles
  stable var battleEntries    : [(Nat, Battle)] = [];
  stable var battleCounter    : Nat = 0;
  // AI factions (initialised once)
  stable var aiFactions       : [AiFaction] = [];

  // harvest cooldown: 1 hour in nanoseconds
  let HARVEST_COOLDOWN_NS : Int = 3_600_000_000_000;
  // battle duration: 10 minutes in nanoseconds
  let BATTLE_DURATION_NS  : Int = 600_000_000_000;

  // Avatar FRNTR costs (8 decimals)
  let SENTINEL_COST : Nat = 500_000_000_000; // 5,000 FRNTR
  let PHANTOM_COST  : Nat = 2_000_000_000_000; // 20,000 FRNTR
  let REAPER_COST   : Nat = 5_000_000_000_000; // 50,000 FRNTR

  // ─── Runtime Maps ────────────────────────────────────────────────────────

  var lastHarvest = HashMap.fromIter<Nat, Int>(harvestEntries.vals(), 1000, Nat.equal, func(n) { Text.hash(Nat.toText(n)) });
  var avatars     = HashMap.fromIter<Principal, CommanderAvatar>(avatarEntries.vals(), 100, Principal.equal, Principal.hash);
  var battles     = HashMap.fromIter<Nat, Battle>(battleEntries.vals(), 100, Nat.equal, func(n) { Text.hash(Nat.toText(n)) });

  // ─── System Hooks ────────────────────────────────────────────────────────

  system func preupgrade() {
    harvestEntries := Iter.toArray(lastHarvest.entries());
    avatarEntries  := Iter.toArray(avatars.entries());
    battleEntries  := Iter.toArray(battles.entries());
  };

  system func postupgrade() {
    lastHarvest := HashMap.fromIter<Nat, Int>(harvestEntries.vals(), 1000, Nat.equal, func(n) { Text.hash(Nat.toText(n)) });
    avatars     := HashMap.fromIter<Principal, CommanderAvatar>(avatarEntries.vals(), 100, Principal.equal, Principal.hash);
    battles     := HashMap.fromIter<Nat, Battle>(battleEntries.vals(), 100, Nat.equal, func(n) { Text.hash(Nat.toText(n)) });
    harvestEntries := [];
    avatarEntries  := [];
    battleEntries  := [];
  };

  // ─── Admin Setup ─────────────────────────────────────────────────────────

  public shared(msg) func init(
    landNft   : Principal,
    token     : Principal,
  ) : async () {
    if (admin == Principal.fromText("aaaaa-aa")) {
      admin := msg.caller;
    };
    assert(msg.caller == admin);
    landNftCanister       := landNft;
    frontierTokenCanister := token;
  };

  public shared(msg) func init_ai_factions() : async Text {
    assert(msg.caller == admin);
    aiFactions := [
      { name = "NEXUS-7";  color = "#00ffff"; plotIds = [] },
      { name = "KRONOS";   color = "#ff4400"; plotIds = [] },
      { name = "VANGUARD"; color = "#00ff88"; plotIds = [] },
      { name = "SPECTRE";  color = "#aa00ff"; plotIds = [] },
    ];
    "AI factions initialised"
  };

  // ─── Canister Interfaces (inter-canister) ────────────────────────────────

  type LandNFT = actor {
    icrc7_owner_of   : (Nat) -> async ?Principal;
    icrc7_transfer   : ({ from : Principal; to : Principal; tokenId : Nat }) -> async { #Ok : Nat; #Err : Text };
    icrc7_token_metadata : (Nat) -> async ?{
      tokenId : Nat; biome : { #Forest; #Desert; #Mountain; #Plains; #Water; #Tundra; #Volcanic; #Swamp };
      lat : Int; lon : Int;
      ironYield : Nat; fuelYield : Nat; crystalYield : Nat;
    };
  };

  type FrontierToken = actor {
    mint : (Principal, Nat) -> async { #Ok : Nat; #Err : Text };
    burn : (Principal, Nat) -> async { #Ok : Nat; #Err : Text };
  };

  // ─── Harvesting ──────────────────────────────────────────────────────────

  /**
   * harvest — caller must own the plot.
   * Calculates FRNTR earned since last harvest and mints it.
   */
  public shared(msg) func harvest(plotId : Nat) : async { #Ok : Nat; #Err : Text } {
    let nft : LandNFT = actor(Principal.toText(landNftCanister));

    // Verify ownership
    let ownerOpt = await nft.icrc7_owner_of(plotId);
    switch (ownerOpt) {
      case null     { return #Err("Plot does not exist") };
      case (?owner) {
        if (owner != msg.caller) {
          return #Err("You do not own this plot");
        };
      };
    };

    // Check cooldown
    let now = Time.now();
    let lastTime = Option.get(lastHarvest.get(plotId), 0 : Int);
    if (now - lastTime < HARVEST_COOLDOWN_NS) {
      return #Err("Plot is on harvest cooldown");
    };

    // Get yields from metadata
    let metaOpt = await nft.icrc7_token_metadata(plotId);
    let (iron, fuel, crystal) = switch (metaOpt) {
      case null    { (10, 10, 10) };
      case (?meta) { (meta.ironYield, meta.fuelYield, meta.crystalYield) };
    };

    // Mint FRNTR proportional to yields (total yield × 1_000_000 base units)
    let totalYield = (iron + fuel + crystal) * 1_000_000;
    let token : FrontierToken = actor(Principal.toText(frontierTokenCanister));
    let mintResult = await token.mint(msg.caller, totalYield);

    switch (mintResult) {
      case (#Err(e)) { return #Err("Mint failed: " # e) };
      case (#Ok(_))  {
        lastHarvest.put(plotId, now);
        return #Ok(totalYield);
      };
    };
  };

  // ─── PvP Battles ─────────────────────────────────────────────────────────

  /**
   * initiate_battle — start a 10-min battle for a plot.
   */
  public shared(msg) func initiate_battle(plotId : Nat) : async { #Ok : Nat; #Err : Text } {
    let nft : LandNFT = actor(Principal.toText(landNftCanister));

    let defenderOpt = await nft.icrc7_owner_of(plotId);
    switch (defenderOpt) {
      case null          { return #Err("Plot does not exist") };
      case (?defender)   {
        if (defender == msg.caller) {
          return #Err("Cannot attack your own plot");
        };

        let battleId = battleCounter;
        battleCounter += 1;

        let battle : Battle = {
          id       = battleId;
          attacker = msg.caller;
          defender = defender;
          plotId   = plotId;
          startTime = Time.now();
          status   = #Active;
          winner   = null;
        };
        battles.put(battleId, battle);
        return #Ok(battleId);
      };
    };
  };

  /**
   * resolve_battle — can be called by anyone after 10 minutes.
   * Winner determined by combat stats (simplified: attacker wins if no avatar disadvantage).
   */
  public shared(msg) func resolve_battle(battleId : Nat) : async { #Ok : Text; #Err : Text } {
    switch (battles.get(battleId)) {
      case null { return #Err("Battle not found") };
      case (?battle) {
        if (battle.status != #Active) {
          return #Err("Battle already resolved");
        };

        let now = Time.now();
        if (now - battle.startTime < BATTLE_DURATION_NS) {
          return #Err("Battle still in progress");
        };

        // Combat resolution: compare avatar tiers
        let attackerBonus = switch (avatars.get(battle.attacker)) {
          case null    0;
          case (?av)   switch (av.tier) { case (#Sentinel) 5; case (#Phantom) 15; case (#Reaper) 30 };
        };
        let defenderBonus = switch (avatars.get(battle.defender)) {
          case null    10; // defender home advantage
          case (?av)   switch (av.tier) { case (#Sentinel) 15; case (#Phantom) 25; case (#Reaper) 40 };
        };

        let winner = if (attackerBonus >= defenderBonus) battle.attacker else battle.defender;

        // If attacker wins, transfer plot NFT
        if (winner == battle.attacker) {
          let nft : LandNFT = actor(Principal.toText(landNftCanister));
          let _ = await nft.icrc7_transfer({
            from    = battle.defender;
            to      = battle.attacker;
            tokenId = battle.plotId;
          });
        };

        let resolved : Battle = {
          id        = battle.id;
          attacker  = battle.attacker;
          defender  = battle.defender;
          plotId    = battle.plotId;
          startTime = battle.startTime;
          status    = #Resolved;
          winner    = ?winner;
        };
        battles.put(battleId, resolved);
        return #Ok("Battle resolved. Winner: " # Principal.toText(winner));
      };
    };
  };

  // ─── Commander Avatars ───────────────────────────────────────────────────

  /**
   * mint_avatar — burn FRNTR tokens to mint a commander avatar NFT.
   */
  public shared(msg) func mint_avatar(tier : AvatarTier) : async { #Ok : Text; #Err : Text } {
    if (Option.isSome(avatars.get(msg.caller))) {
      return #Err("You already have a Commander Avatar");
    };

    let cost = switch (tier) {
      case (#Sentinel) SENTINEL_COST;
      case (#Phantom)  PHANTOM_COST;
      case (#Reaper)   REAPER_COST;
    };

    let token : FrontierToken = actor(Principal.toText(frontierTokenCanister));
    let burnResult = await token.burn(msg.caller, cost);

    switch (burnResult) {
      case (#Err(e)) { return #Err("Burn failed: " # e) };
      case (#Ok(_))  {
        let bonus = switch (tier) { case (#Sentinel) 5; case (#Phantom) 15; case (#Reaper) 30 };
        let avatar : CommanderAvatar = {
          owner       = msg.caller;
          tier        = tier;
          mintedAt    = Time.now();
          combatBonus = bonus;
        };
        avatars.put(msg.caller, avatar);
        let tierName = switch (tier) { case (#Sentinel) "Sentinel"; case (#Phantom) "Phantom"; case (#Reaper) "Reaper" };
        return #Ok("Commander Avatar minted: " # tierName);
      };
    };
  };

  // ─── Query Functions ─────────────────────────────────────────────────────

  public query func get_avatar(player : Principal) : async ?CommanderAvatar {
    avatars.get(player)
  };

  public query func get_battle(battleId : Nat) : async ?Battle {
    battles.get(battleId)
  };

  public query func get_harvest_cooldown(plotId : Nat) : async Int {
    let now = Time.now();
    let lastTime = Option.get(lastHarvest.get(plotId), 0 : Int);
    let elapsed = now - lastTime;
    if (elapsed >= HARVEST_COOLDOWN_NS) 0
    else HARVEST_COOLDOWN_NS - elapsed
  };

  public query func get_ai_factions() : async [AiFaction] {
    aiFactions
  };
}
