# 12th Man

World Cup passion, recorded where it can't be deleted.

Fans register an on-chain fan card for their national team, post chants to a
global wall, and lock score predictions before kickoff. Exact score gets you
3 points, calling the right winner gets 1. Team totals feed a leaderboard of
the loudest fanbase on the planet.

Everything lives in a single Anchor program on Solana devnet — no database,
no backend. Chants cost a fraction of a cent, which is the whole reason this
works: cheering on-chain is only sane on a chain where a transaction costs
less than a sticker.

## Program

`EwCR98M9we9XSNpNA7jnSh9HKXdQWtZPonLdJZ6yM6Kc` (devnet)

Accounts: config, fan card (PDA per wallet), team stats (PDA per FIFA code),
chant (PDA per fan + index), match, prediction (PDA per match + wallet).

Instructions: `initialize`, `register_fan`, `post_chant`, `create_match`,
`post_result`, `predict`, `settle_prediction`. Settlement is a permissionless
crank — anyone can settle anyone's prediction once a result is posted.

## Run it

```sh
anchor build
anchor test        # spins a local validator
anchor deploy --provider.cluster devnet
yarn seed          # loads the current knockout fixtures (scripts/fixtures.json)
```

Frontend lives in `app/`:

```sh
cd app
yarn && yarn dev
```

## Testing it yourself

You need the Phantom (or Solflare) browser extension and about 2 minutes.
The app also has this guide built in, at `/demo`.

1. Flip Phantom into play-money mode: Settings → Developer Settings →
   Testnet Mode ON. That switches it to Solana's practice network (devnet) —
   nothing here costs real money.

2. Import a ready-made test account (Phantom → Add / Connect Wallet → Import
   Recovery Phrase). Both are loaded with 1.5 devnet SOL, and both are
   **shared public test accounts — devnet only, no real value**:

   Test account A (`31hosojNPTCvzqzsBPkLve95hn4qdmz26dvKnoX4woYe`):

   ```
   discover hero tent veteran pole denial intact autumn list job finish gown
   ```

   Test account B (`CKz9PsKMGSQMRLvAaPewXeeddes7Wk2QgRGpbQxSE3Ys`):

   ```
   arrow kitten raise clip script capital sorry foot vendor twist oxygen rally
   ```

   One team per account, forever — if the account already has a Fan Card,
   that step is done; everything else still works. There are two accounts so
   a second tester can pick a rival team.

   Or use your own wallet: switch it to devnet and grab free practice SOL
   from [faucet.solana.com](https://faucet.solana.com).

3. The test script: get your Fan Card → post a chant (watch it hit the live
   wall) → call a score on an upcoming match → check the leaderboard. Results
   land automatically after full time and points appear on your card.

## Notes

- Match results are posted by the admin key that ran `initialize`. Fine for a
  hackathon; an oracle would replace this in anything real.
- `Cargo.lock` pins a few crates (indexmap, borsh, blake3, zeroize,
  unicode-segmentation) below versions that need rustc 1.85+, because the
  Solana platform tools still ship 1.84. Don't `cargo update` blindly.
