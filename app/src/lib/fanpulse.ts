import { BorshCoder, EventParser, utils, type Idl } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  type GetProgramAccountsFilter,
} from "@solana/web3.js";
import { IDL } from "./idl";

export const PROGRAM_ID = new PublicKey(IDL.address);
export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ?? "https://api.devnet.solana.com";
export const MAX_CHANT_LEN = 140;

const coder = new BorshCoder(IDL as unknown as Idl);
const eventParser = new EventParser(PROGRAM_ID, coder);

// ---- PDAs ----

export function configPda(): PublicKey {
  return PublicKey.findProgramAddressSync([Buffer.from("config")], PROGRAM_ID)[0];
}

export function fanCardPda(owner: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("fan"), owner.toBuffer()],
    PROGRAM_ID
  )[0];
}

export function teamStatsPda(code: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("team"), Buffer.from(code)],
    PROGRAM_ID
  )[0];
}

export function chantPda(fanCard: PublicKey, index: number): PublicKey {
  const buf = Buffer.alloc(4);
  buf.writeUInt32LE(index);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("chant"), fanCard.toBuffer(), buf],
    PROGRAM_ID
  )[0];
}

export function matchPda(id: number): PublicKey {
  const buf = Buffer.alloc(2);
  buf.writeUInt16LE(id);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("match"), buf],
    PROGRAM_ID
  )[0];
}

export function predictionPda(matchAccount: PublicKey, owner: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("prediction"), matchAccount.toBuffer(), owner.toBuffer()],
    PROGRAM_ID
  )[0];
}

// ---- Decoded account shapes ----

export type FanCard = {
  address: PublicKey;
  owner: PublicKey;
  team: string;
  fanSince: number;
  chantCount: number;
  points: number;
};

export type TeamStats = {
  code: string;
  fanCount: number;
  chantCount: number;
  points: number;
};

export type Chant = {
  address: PublicKey;
  author: PublicKey;
  team: string;
  text: string;
  matchId: number;
  timestamp: number;
};

export type Match = {
  address: PublicKey;
  id: number;
  home: string;
  away: string;
  kickoffTs: number;
  homeScore: number;
  awayScore: number;
  settled: boolean;
};

export type Prediction = {
  owner: PublicKey;
  matchId: number;
  homeScore: number;
  awayScore: number;
  predictedAt: number;
  points: number;
  settled: boolean;
};

function teamCode(bytes: number[] | Uint8Array): string {
  return String.fromCharCode(...Array.from(bytes));
}

function decodeFanCard(address: PublicKey, data: Buffer): FanCard {
  const d = coder.accounts.decode("FanCard", data);
  return {
    address,
    owner: d.owner,
    team: teamCode(d.team),
    fanSince: d.fan_since.toNumber(),
    chantCount: d.chant_count,
    points: d.points,
  };
}

function decodeChant(address: PublicKey, data: Buffer): Chant {
  const d = coder.accounts.decode("Chant", data);
  return {
    address,
    author: d.author,
    team: teamCode(d.team),
    text: d.text,
    matchId: d.match_id,
    timestamp: d.timestamp.toNumber(),
  };
}

function decodeTeamStats(data: Buffer): TeamStats {
  const d = coder.accounts.decode("TeamStats", data);
  return {
    code: teamCode(d.code),
    fanCount: d.fan_count,
    chantCount: d.chant_count.toNumber(),
    points: d.points.toNumber(),
  };
}

function decodeMatch(address: PublicKey, data: Buffer): Match {
  const d = coder.accounts.decode("MatchAccount", data);
  return {
    address,
    id: d.id,
    home: teamCode(d.home),
    away: teamCode(d.away),
    kickoffTs: d.kickoff_ts.toNumber(),
    homeScore: d.home_score,
    awayScore: d.away_score,
    settled: d.settled,
  };
}

function decodePrediction(data: Buffer): Prediction {
  const d = coder.accounts.decode("Prediction", data);
  return {
    owner: d.owner,
    matchId: d.match_id,
    homeScore: d.home_score,
    awayScore: d.away_score,
    predictedAt: d.predicted_at.toNumber(),
    points: d.points,
    settled: d.settled,
  };
}

// ---- Reads ----

function discriminatorFilter(account: string): GetProgramAccountsFilter {
  const disc = IDL.accounts.find((a) => a.name === account)!.discriminator;
  return {
    memcmp: { offset: 0, bytes: utils.bytes.bs58.encode(Buffer.from(disc)) },
  };
}

export async function fetchFanCard(
  conn: Connection,
  owner: PublicKey
): Promise<FanCard | null> {
  const address = fanCardPda(owner);
  const info = await conn.getAccountInfo(address);
  return info ? decodeFanCard(address, info.data) : null;
}

export async function fetchAllChants(conn: Connection): Promise<Chant[]> {
  const accounts = await conn.getProgramAccounts(PROGRAM_ID, {
    filters: [discriminatorFilter("Chant")],
  });
  return accounts
    .map((a) => decodeChant(a.pubkey, a.account.data))
    .sort((a, b) => b.timestamp - a.timestamp);
}

export async function fetchAllTeamStats(conn: Connection): Promise<TeamStats[]> {
  const accounts = await conn.getProgramAccounts(PROGRAM_ID, {
    filters: [discriminatorFilter("TeamStats")],
  });
  return accounts.map((a) => decodeTeamStats(a.account.data));
}

export async function fetchAllMatches(conn: Connection): Promise<Match[]> {
  const accounts = await conn.getProgramAccounts(PROGRAM_ID, {
    filters: [discriminatorFilter("MatchAccount")],
  });
  return accounts
    .map((a) => decodeMatch(a.pubkey, a.account.data))
    .sort((a, b) => a.kickoffTs - b.kickoffTs);
}

export async function fetchPredictions(
  conn: Connection,
  owner: PublicKey
): Promise<Prediction[]> {
  const accounts = await conn.getProgramAccounts(PROGRAM_ID, {
    filters: [
      discriminatorFilter("Prediction"),
      { memcmp: { offset: 8, bytes: owner.toBase58() } },
    ],
  });
  return accounts.map((a) => decodePrediction(a.account.data));
}

// ---- Events ----

export type ChantEvent = {
  author: PublicKey;
  team: string;
  text: string;
  matchId: number;
  timestamp: number;
};

export function parseChantEvents(logs: string[]): ChantEvent[] {
  const out: ChantEvent[] = [];
  try {
    for (const ev of eventParser.parseLogs(logs)) {
      if (ev.name !== "ChantPosted") continue;
      const d = ev.data as any;
      out.push({
        author: d.author,
        team: teamCode(d.team),
        text: d.text,
        matchId: d.match_id,
        timestamp: d.timestamp.toNumber(),
      });
    }
  } catch {
    // unparseable logs from other programs sharing the tx — ignore
  }
  return out;
}

// ---- Instructions ----

function ix(
  name: string,
  args: Record<string, unknown>,
  keys: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[]
): TransactionInstruction {
  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys,
    data: coder.instruction.encode(name, args),
  });
}

export function registerFanIx(owner: PublicKey, code: string): TransactionInstruction {
  return ix("register_fan", { team_code: code }, [
    { pubkey: fanCardPda(owner), isSigner: false, isWritable: true },
    { pubkey: teamStatsPda(code), isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: true, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ]);
}

export function postChantIx(
  fan: FanCard,
  text: string,
  matchId: number
): TransactionInstruction {
  return ix("post_chant", { text, match_id: matchId }, [
    { pubkey: fan.address, isSigner: false, isWritable: true },
    { pubkey: teamStatsPda(fan.team), isSigner: false, isWritable: true },
    { pubkey: chantPda(fan.address, fan.chantCount), isSigner: false, isWritable: true },
    { pubkey: fan.owner, isSigner: true, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ]);
}

export function predictIx(
  owner: PublicKey,
  matchId: number,
  homeScore: number,
  awayScore: number
): TransactionInstruction {
  const match = matchPda(matchId);
  return ix("predict", { home_score: homeScore, away_score: awayScore }, [
    { pubkey: match, isSigner: false, isWritable: false },
    { pubkey: fanCardPda(owner), isSigner: false, isWritable: false },
    { pubkey: predictionPda(match, owner), isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: true, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ]);
}

export function settlePredictionIx(
  matchId: number,
  predictionOwner: PublicKey,
  fanTeam: string
): TransactionInstruction {
  const match = matchPda(matchId);
  return ix("settle_prediction", {}, [
    { pubkey: match, isSigner: false, isWritable: false },
    { pubkey: predictionPda(match, predictionOwner), isSigner: false, isWritable: true },
    { pubkey: fanCardPda(predictionOwner), isSigner: false, isWritable: true },
    { pubkey: teamStatsPda(fanTeam), isSigner: false, isWritable: true },
  ]);
}

// ---- Send ----

type WalletLike = {
  publicKey: PublicKey;
  sendTransaction: (tx: Transaction, conn: Connection) => Promise<string>;
};

export async function sendIx(
  conn: Connection,
  wallet: WalletLike,
  instruction: TransactionInstruction
): Promise<string> {
  const tx = new Transaction().add(instruction);
  tx.feePayer = wallet.publicKey;
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  const sig = await wallet.sendTransaction(tx, conn);
  await conn.confirmTransaction(
    { signature: sig, blockhash, lastValidBlockHeight },
    "confirmed"
  );
  return sig;
}
