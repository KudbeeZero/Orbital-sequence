/**
 * FrontierToken — ICRC-1 fungible token canister for Zero Colony.
 *
 * Token: FRONTIER (FRNTR), 8 decimals.
 * Earned passively by harvesting owned land plots.
 * Burned to mint Commander Avatar NFTs.
 * Only the game_state canister can mint/burn.
 */

import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";

actor FrontierToken {

  // ─── Types ───────────────────────────────────────────────────────────────

  public type Account = { owner : Principal; subaccount : ?[Nat8] };

  public type TransferArgs = {
    from_subaccount : ?[Nat8];
    to              : Account;
    amount          : Nat;
    fee             : ?Nat;
    memo            : ?[Nat8];
    created_at_time : ?Nat64;
  };

  public type TransferError = {
    #BadFee        : { expected_fee : Nat };
    #BadBurn       : { min_burn_amount : Nat };
    #InsufficientFunds : { balance : Nat };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate     : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError  : { error_code : Nat; message : Text };
  };

  public type TransferResult = { #Ok : Nat; #Err : TransferError };

  // ─── Constants ───────────────────────────────────────────────────────────

  let TOKEN_NAME     : Text = "FRONTIER";
  let TOKEN_SYMBOL   : Text = "FRNTR";
  let TOKEN_DECIMALS : Nat8 = 8;
  let TOKEN_FEE      : Nat  = 10_000; // 0.0001 FRNTR

  // ─── Stable State ────────────────────────────────────────────────────────

  stable var balanceEntries : [(Principal, Nat)] = [];
  stable var totalSupplyVar : Nat = 0;
  stable var admin          : Principal = Principal.fromText("aaaaa-aa");
  // The game_state canister ID — set by admin after deploy
  stable var gameStateCanister : Principal = Principal.fromText("aaaaa-aa");
  stable var txCounter : Nat = 0;

  // ─── Runtime Maps ────────────────────────────────────────────────────────

  var balances = HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1000, Principal.equal, Principal.hash);

  // ─── System Hooks ────────────────────────────────────────────────────────

  system func preupgrade() {
    balanceEntries := Iter.toArray(balances.entries());
  };

  system func postupgrade() {
    balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1000, Principal.equal, Principal.hash);
    balanceEntries := [];
  };

  // ─── Admin ───────────────────────────────────────────────────────────────

  public shared(msg) func set_admin(newAdmin : Principal) : async () {
    assert(msg.caller == admin or admin == Principal.fromText("aaaaa-aa"));
    admin := newAdmin;
  };

  public shared(msg) func set_game_state_canister(canisterId : Principal) : async () {
    assert(msg.caller == admin);
    gameStateCanister := canisterId;
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────

  func getBalance(p : Principal) : Nat {
    Option.get(balances.get(p), 0)
  };

  // ─── Mint (game_state canister only) ────────────────────────────────────

  public shared(msg) func mint(to : Principal, amount : Nat) : async { #Ok : Nat; #Err : Text } {
    if (msg.caller != gameStateCanister and msg.caller != admin) {
      return #Err("Not authorised to mint");
    };
    let current = getBalance(to);
    balances.put(to, current + amount);
    totalSupplyVar += amount;
    txCounter += 1;
    #Ok(txCounter)
  };

  // ─── Burn (game_state canister only) ────────────────────────────────────

  public shared(msg) func burn(from : Principal, amount : Nat) : async { #Ok : Nat; #Err : Text } {
    if (msg.caller != gameStateCanister and msg.caller != admin) {
      return #Err("Not authorised to burn");
    };
    let current = getBalance(from);
    if (current < amount) {
      return #Err("Insufficient balance to burn");
    };
    balances.put(from, current - amount);
    totalSupplyVar -= amount;
    txCounter += 1;
    #Ok(txCounter)
  };

  // ─── ICRC-1 Interface ────────────────────────────────────────────────────

  public query func icrc1_name()     : async Text  { TOKEN_NAME };
  public query func icrc1_symbol()   : async Text  { TOKEN_SYMBOL };
  public query func icrc1_decimals() : async Nat8  { TOKEN_DECIMALS };
  public query func icrc1_fee()      : async Nat   { TOKEN_FEE };
  public query func icrc1_total_supply() : async Nat { totalSupplyVar };

  public query func icrc1_balance_of(account : Account) : async Nat {
    getBalance(account.owner)
  };

  public shared(msg) func icrc1_transfer(args : TransferArgs) : async TransferResult {
    let fee = Option.get(args.fee, TOKEN_FEE);
    if (fee != TOKEN_FEE) {
      return #Err(#BadFee { expected_fee = TOKEN_FEE });
    };

    let senderBalance = getBalance(msg.caller);
    let total = args.amount + fee;

    if (senderBalance < total) {
      return #Err(#InsufficientFunds { balance = senderBalance });
    };

    balances.put(msg.caller, senderBalance - total);

    let recipientBalance = getBalance(args.to.owner);
    balances.put(args.to.owner, recipientBalance + args.amount);

    // Burn the fee (reduce supply)
    totalSupplyVar -= fee;

    txCounter += 1;
    #Ok(txCounter)
  };

  public query func icrc1_metadata() : async [(Text, { #Nat : Nat; #Text : Text; #Int : Int; #Blob : [Nat8] })] {
    [
      ("icrc1:name",     #Text TOKEN_NAME),
      ("icrc1:symbol",   #Text TOKEN_SYMBOL),
      ("icrc1:decimals", #Nat(Nat8.toNat(TOKEN_DECIMALS))),
      ("icrc1:fee",      #Nat TOKEN_FEE),
    ]
  };

  public query func icrc1_supported_standards() : async [{ name : Text; url : Text }] {
    [{ name = "ICRC-1"; url = "https://github.com/dfinity/ICRC-1" }]
  };
}
