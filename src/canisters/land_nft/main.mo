/**
 * LandNFT — ICRC-7 NFT canister for Zero Colony land plots.
 *
 * Manages 21,000 plots across 8 biomes on a persistent globe.
 * Each plot is an NFT that lives in a player's ICP wallet.
 * Biomes: Forest, Desert, Mountain, Plains, Water, Tundra, Volcanic, Swamp
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

actor LandNFT {

  // ─── Types ───────────────────────────────────────────────────────────────

  public type Biome = {
    #Forest;
    #Desert;
    #Mountain;
    #Plains;
    #Water;
    #Tundra;
    #Volcanic;
    #Swamp;
  };

  public type PlotMetadata = {
    tokenId   : Nat;
    biome     : Biome;
    lat       : Int;   // -90 to 90 (degrees × 100 for fixed point)
    lon       : Int;   // -180 to 180 (degrees × 100 for fixed point)
    ironYield    : Nat; // base iron per harvest cycle
    fuelYield    : Nat; // base fuel per harvest cycle
    crystalYield : Nat; // base crystal per harvest cycle
  };

  public type TransferArgs = {
    from    : Principal;
    to      : Principal;
    tokenId : Nat;
  };

  public type TransferResult = {
    #Ok : Nat;    // block index
    #Err : Text;
  };

  // ─── Constants ───────────────────────────────────────────────────────────

  let TOTAL_PLOTS : Nat = 21_000;

  // ─── Stable State ────────────────────────────────────────────────────────

  // owner map: token_id → owner principal
  stable var ownerEntries : [(Nat, Principal)] = [];
  // metadata: token_id → PlotMetadata
  stable var metadataEntries : [(Nat, PlotMetadata)] = [];
  // admin (deployer) principal — set at init
  stable var admin : Principal = Principal.fromText("aaaaa-aa");

  // ─── Runtime Maps ────────────────────────────────────────────────────────

  var owners   = HashMap.fromIter<Nat, Principal>(ownerEntries.vals(), TOTAL_PLOTS, Nat.equal, func(n: Nat) { Text.hash(Nat.toText(n)) });
  var metadata = HashMap.fromIter<Nat, PlotMetadata>(metadataEntries.vals(), TOTAL_PLOTS, Nat.equal, func(n: Nat) { Text.hash(Nat.toText(n)) });

  // ─── System Hooks ────────────────────────────────────────────────────────

  system func preupgrade() {
    ownerEntries   := Iter.toArray(owners.entries());
    metadataEntries := Iter.toArray(metadata.entries());
  };

  system func postupgrade() {
    owners   := HashMap.fromIter<Nat, Principal>(ownerEntries.vals(), TOTAL_PLOTS, Nat.equal, func(n: Nat) { Text.hash(Nat.toText(n)) });
    metadata := HashMap.fromIter<Nat, PlotMetadata>(metadataEntries.vals(), TOTAL_PLOTS, Nat.equal, func(n: Nat) { Text.hash(Nat.toText(n)) });
    ownerEntries   := [];
    metadataEntries := [];
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────

  func biomeFromIndex(i : Nat) : Biome {
    let idx = i % 8;
    if      (idx == 0) #Forest
    else if (idx == 1) #Desert
    else if (idx == 2) #Mountain
    else if (idx == 3) #Plains
    else if (idx == 4) #Water
    else if (idx == 5) #Tundra
    else if (idx == 6) #Volcanic
    else               #Swamp
  };

  // Map biome to resource yields
  func yieldsForBiome(b : Biome) : (Nat, Nat, Nat) {
    switch (b) {
      case (#Forest)   { (30, 10, 20) };
      case (#Desert)   { (20, 40, 10) };
      case (#Mountain) { (50, 15, 35) };
      case (#Plains)   { (40, 20, 10) };
      case (#Water)    { (10, 50, 25) };
      case (#Tundra)   { (25, 30, 40) };
      case (#Volcanic) { (60, 45, 15) };
      case (#Swamp)    { (15, 20, 50) };
    }
  };

  // ─── Admin: Initialise Plots ─────────────────────────────────────────────

  /**
   * init_plots — called once by admin after deploy.
   * Mints all 21,000 plots with deterministic metadata.
   * Unowned plots sit in the canister until purchased.
   */
  public shared(msg) func init_plots() : async Text {
    assert(msg.caller == admin or admin == Principal.fromText("aaaaa-aa"));
    if (admin == Principal.fromText("aaaaa-aa")) {
      admin := msg.caller;
    };

    if (metadata.size() > 0) {
      return "Already initialised";
    };

    var i : Nat = 0;
    while (i < TOTAL_PLOTS) {
      let b = biomeFromIndex(i);
      let (iron, fuel, crystal) = yieldsForBiome(b);
      // Spread plots evenly across the globe using a simple grid mapping
      let latRaw : Int = ((i / 210) * 900 / 100) - 90;   // -90 to +89
      let lonRaw : Int = ((i % 210) * 3429 / 1000) - 180; // -180 to +179
      let plot : PlotMetadata = {
        tokenId      = i;
        biome        = b;
        lat          = latRaw * 100;
        lon          = lonRaw * 100;
        ironYield    = iron;
        fuelYield    = fuel;
        crystalYield = crystal;
      };
      metadata.put(i, plot);
      i += 1;
    };
    return "Initialised " # Nat.toText(TOTAL_PLOTS) # " plots";
  };

  // ─── Admin: Assign Plot to Buyer ─────────────────────────────────────────

  /**
   * purchase_plot — transfers an unowned plot to a buyer.
   * In production this would be gated by a payment check.
   */
  public shared(msg) func purchase_plot(tokenId : Nat, buyer : Principal) : async TransferResult {
    assert(msg.caller == admin);
    if (tokenId >= TOTAL_PLOTS) {
      return #Err("Invalid token ID");
    };
    switch (owners.get(tokenId)) {
      case (?_existing) { return #Err("Plot already owned") };
      case null {
        owners.put(tokenId, buyer);
        return #Ok(tokenId);
      };
    };
  };

  // ─── ICRC-7 Interface ────────────────────────────────────────────────────

  /// Returns the owner of a token, or null if unowned.
  public query func icrc7_owner_of(tokenId : Nat) : async ?Principal {
    owners.get(tokenId)
  };

  /// Returns the number of tokens owned by a principal.
  public query func icrc7_balance_of(owner : Principal) : async Nat {
    var count : Nat = 0;
    for ((_, o) in owners.entries()) {
      if (o == owner) { count += 1 };
    };
    count
  };

  /// Transfers a token from one principal to another.
  public shared(msg) func icrc7_transfer(args : TransferArgs) : async TransferResult {
    let { from; to; tokenId } = args;
    // Caller must be the current owner or an approved operator
    switch (owners.get(tokenId)) {
      case null     { return #Err("Token does not exist") };
      case (?owner) {
        if (owner != msg.caller and msg.caller != admin) {
          return #Err("Not authorised");
        };
        if (owner != from) {
          return #Err("From mismatch");
        };
        owners.put(tokenId, to);
        return #Ok(tokenId);
      };
    };
  };

  /// Returns metadata for a token.
  public query func icrc7_token_metadata(tokenId : Nat) : async ?PlotMetadata {
    metadata.get(tokenId)
  };

  /// Returns all token IDs owned by a principal.
  public query func get_tokens_of(owner : Principal) : async [Nat] {
    let buf = Array.init<Nat>(owners.size(), 0);
    var idx : Nat = 0;
    for ((tokenId, o) in owners.entries()) {
      if (o == owner) {
        buf[idx] := tokenId;
        idx += 1;
      };
    };
    Array.tabulate<Nat>(idx, func(i) { buf[i] })
  };

  /// Returns the total supply (always 21,000).
  public query func icrc7_total_supply() : async Nat { TOTAL_PLOTS };

  /// Returns the collection name.
  public query func icrc7_name() : async Text { "Zero Colony Land Plots" };

  /// Returns the collection symbol.
  public query func icrc7_symbol() : async Text { "ZCPLOT" };

  /// Returns metadata for a range of plots (pagination-friendly).
  public query func get_plots_range(start : Nat, count : Nat) : async [PlotMetadata] {
    let end = if (start + count > TOTAL_PLOTS) TOTAL_PLOTS else start + count;
    Array.tabulate<PlotMetadata>(
      end - start,
      func(i) {
        switch (metadata.get(start + i)) {
          case (?m) m;
          case null {
            {
              tokenId = start + i; biome = #Plains;
              lat = 0; lon = 0;
              ironYield = 0; fuelYield = 0; crystalYield = 0;
            }
          };
        }
      }
    )
  };
}
