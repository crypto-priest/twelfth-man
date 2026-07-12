# 12th Man

World Cup passion, recorded where it can't be deleted.

Every team has eleven players; the crowd is the twelfth. Fans register an
on-chain Fan Card for their national team, post chants to a global wall, and
lock score predictions before kickoff. Exact score gets you 3 points, calling
the right winner gets 1. Team totals feed a leaderboard of the loudest
fanbase on the planet.

Everything lives in a single Anchor program on Solana devnet. No database,
no backend. Chants cost a fraction of a cent, which is the whole reason this
works: cheering on-chain is only sane on a chain where a transaction costs
less than a sticker. The frontend is a Next.js app with a light silver-glass
look, frosted panels on a bright matchday background.

## Program

`EwCR98M9we9XSNpNA7jnSh9HKXdQWtZPonLdJZ6yM6Kc` on devnet
([explorer](https://explorer.solana.com/address/EwCR98M9we9XSNpNA7jnSh9HKXdQWtZPonLdJZ6yM6Kc?cluster=devnet))

### Accounts

| Account | Seeds | Holds |
| --- | --- | --- |
| Config | `["config"]` | admin key |
| FanCard | `["fan", wallet]` | team, points, chant count (one per wallet) |
| TeamStats | `["team", code]` | fan count and point total per FIFA code |
| Chant | `["chant", fan_card, index]` | 140-char text, permanently attributed |
| MatchAccount | `["match", id]` | teams, kickoff time, final score |
| Prediction | `["prediction", match, wallet]` | scoreline, locked before kickoff |

### Instructions

| Instruction | Who | What |
| --- | --- | --- |
| `initialize` | admin | create config, set admin key |
| `register_fan` | anyone | mint your Fan Card, one team per wallet, forever |
| `post_chant` | fans | post to the chant wall, bumps fan and team counters |
| `create_match` | admin | add a fixture with a kickoff timestamp |
| `post_result` | admin | write the final score (normally done by the oracle) |
| `predict` | fans | lock a scoreline, rejected once kickoff has passed |
| `settle_prediction` | anyone | permissionless crank: 3 pts exact, 1 pt outcome |

Settlement is permissionless: once a result is posted, anyone can settle
anyone's prediction and the points land on the fan card and team total.

## Run it

```sh
anchor build
anchor test        # spins a local validator, 14 tests
anchor deploy --provider.cluster devnet
yarn seed          # loads the current knockout fixtures (scripts/fixtures.json)
yarn oracle        # watches ESPN's scoreboard, posts finals, settles predictions
```

The oracle (`scripts/oracle.ts`) polls the public ESPN scoreboard every 2.5
minutes and only posts a result after two consecutive polls agree the match
is completed, so a stray API blip can't push a bad score on-chain. It posted
the real England 2-1 Norway result this weekend with no human in the loop.

Frontend lives in `app/`:

```sh
cd app
yarn && yarn dev
```

## Testing it yourself

You need the Phantom (or Solflare) browser extension and about 2 minutes.
The app also has this guide built in, at `/demo`.

1. Flip Phantom into play-money mode: Settings, Developer Settings,
   Testnet Mode ON. That switches it to Solana's practice network (devnet),
   nothing here costs real money.

2. Import a ready-made test account (Phantom, Add / Connect Wallet, Import
   Recovery Phrase). Both are loaded with devnet SOL, and both are
   **shared public test accounts, devnet only, no real value**:

   Test account A (`31hosojNPTCvzqzsBPkLve95hn4qdmz26dvKnoX4woYe`):

   ```
   discover hero tent veteran pole denial intact autumn list job finish gown
   ```

   Test account B (`CKz9PsKMGSQMRLvAaPewXeeddes7Wk2QgRGpbQxSE3Ys`):

   ```
   arrow kitten raise clip script capital sorry foot vendor twist oxygen rally
   ```

   One team per account, forever. If the account already has a Fan Card,
   that step is done; everything else still works. There are two accounts so
   a second tester can pick a rival team.

   Or use your own wallet: switch it to devnet and grab free practice SOL
   from [faucet.solana.com](https://faucet.solana.com).

3. The test script: get your Fan Card, post a chant (watch it hit the live
   wall), call a score on an upcoming match, check the leaderboard. Results
   land automatically after full time and points appear on your card.

## Notes

- Match results are posted by the admin key that ran `initialize`. Fine for a
  hackathon; a decentralized oracle network would replace this in anything
  real.
- `Cargo.lock` pins a few crates (indexmap, borsh, blake3, zeroize,
  unicode-segmentation) below versions that need rustc 1.85+, because the
  Solana platform tools still ship 1.84. Don't `cargo update` blindly.
