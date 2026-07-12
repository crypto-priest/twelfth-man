// Hand-written to match programs/twelfth-man/src/lib.rs (Anchor 0.31 IDL format).
// Swap for the generated target/idl json once `anchor build` output is committed.

export const IDL = {
  address: "EwCR98M9we9XSNpNA7jnSh9HKXdQWtZPonLdJZ6yM6Kc",
  metadata: {
    name: "twelfth_man",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        { name: "config", writable: true },
        { name: "admin", writable: true, signer: true },
        { name: "system_program", address: "11111111111111111111111111111111" },
      ],
      args: [],
    },
    {
      name: "register_fan",
      discriminator: [50, 227, 215, 169, 191, 133, 223, 50],
      accounts: [
        { name: "fan_card", writable: true },
        { name: "team_stats", writable: true },
        { name: "owner", writable: true, signer: true },
        { name: "system_program", address: "11111111111111111111111111111111" },
      ],
      args: [{ name: "team_code", type: "string" }],
    },
    {
      name: "post_chant",
      discriminator: [202, 249, 145, 161, 236, 206, 85, 79],
      accounts: [
        { name: "fan_card", writable: true },
        { name: "team_stats", writable: true },
        { name: "chant", writable: true },
        { name: "owner", writable: true, signer: true },
        { name: "system_program", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "text", type: "string" },
        { name: "match_id", type: "u16" },
      ],
    },
    {
      name: "create_match",
      discriminator: [107, 2, 184, 145, 70, 142, 17, 165],
      accounts: [
        { name: "config", writable: true },
        { name: "match_account", writable: true },
        { name: "admin", writable: true, signer: true },
        { name: "system_program", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "id", type: "u16" },
        { name: "home", type: "string" },
        { name: "away", type: "string" },
        { name: "kickoff_ts", type: "i64" },
      ],
    },
    {
      name: "post_result",
      discriminator: [209, 11, 193, 110, 192, 1, 142, 9],
      accounts: [
        { name: "config" },
        { name: "match_account", writable: true },
        { name: "admin", signer: true },
      ],
      args: [
        { name: "home_score", type: "u8" },
        { name: "away_score", type: "u8" },
      ],
    },
    {
      name: "predict",
      discriminator: [254, 114, 112, 244, 37, 49, 32, 128],
      accounts: [
        { name: "match_account" },
        { name: "fan_card" },
        { name: "prediction", writable: true },
        { name: "owner", writable: true, signer: true },
        { name: "system_program", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "home_score", type: "u8" },
        { name: "away_score", type: "u8" },
      ],
    },
    {
      name: "settle_prediction",
      discriminator: [201, 129, 177, 154, 16, 155, 48, 41],
      accounts: [
        { name: "match_account" },
        { name: "prediction", writable: true },
        { name: "fan_card", writable: true },
        { name: "team_stats", writable: true },
      ],
      args: [],
    },
  ],
  accounts: [
    { name: "Config", discriminator: [155, 12, 170, 224, 30, 250, 204, 130] },
    { name: "FanCard", discriminator: [2, 97, 53, 59, 255, 125, 10, 116] },
    { name: "TeamStats", discriminator: [88, 160, 72, 218, 208, 140, 137, 83] },
    { name: "Chant", discriminator: [186, 94, 17, 37, 220, 103, 36, 22] },
    { name: "MatchAccount", discriminator: [235, 36, 243, 39, 81, 16, 144, 87] },
    { name: "Prediction", discriminator: [98, 127, 141, 187, 218, 33, 8, 14] },
  ],
  events: [
    { name: "FanRegistered", discriminator: [74, 15, 121, 152, 86, 29, 126, 104] },
    { name: "ChantPosted", discriminator: [248, 78, 106, 240, 225, 224, 64, 141] },
    { name: "PredictionMade", discriminator: [236, 224, 49, 142, 71, 154, 115, 157] },
    { name: "MatchResultPosted", discriminator: [227, 130, 47, 36, 187, 36, 132, 153] },
  ],
  errors: [
    { code: 6000, name: "InvalidTeamCode", msg: "Team code must be exactly 3 uppercase letters (e.g. ARG, BRA)" },
    { code: 6001, name: "EmptyChant", msg: "Chant cannot be empty" },
    { code: 6002, name: "ChantTooLong", msg: "Chant is longer than 140 characters" },
    { code: 6003, name: "InvalidMatchId", msg: "Match id must be greater than 0" },
    { code: 6004, name: "PredictionClosed", msg: "Kickoff has passed, predictions are closed" },
    { code: 6005, name: "MatchAlreadySettled", msg: "Result already posted for this match" },
    { code: 6006, name: "MatchNotSettled", msg: "Result not posted yet" },
    { code: 6007, name: "PredictionAlreadySettled", msg: "Prediction already settled" },
  ],
  types: [
    {
      name: "Config",
      type: {
        kind: "struct",
        fields: [
          { name: "admin", type: "pubkey" },
          { name: "match_count", type: "u16" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "FanCard",
      type: {
        kind: "struct",
        fields: [
          { name: "owner", type: "pubkey" },
          { name: "team", type: { array: ["u8", 3] } },
          { name: "fan_since", type: "i64" },
          { name: "chant_count", type: "u32" },
          { name: "points", type: "u32" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "TeamStats",
      type: {
        kind: "struct",
        fields: [
          { name: "code", type: { array: ["u8", 3] } },
          { name: "fan_count", type: "u32" },
          { name: "chant_count", type: "u64" },
          { name: "points", type: "u64" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "Chant",
      type: {
        kind: "struct",
        fields: [
          { name: "author", type: "pubkey" },
          { name: "team", type: { array: ["u8", 3] } },
          { name: "text", type: "string" },
          { name: "match_id", type: "u16" },
          { name: "timestamp", type: "i64" },
        ],
      },
    },
    {
      name: "MatchAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "id", type: "u16" },
          { name: "home", type: { array: ["u8", 3] } },
          { name: "away", type: { array: ["u8", 3] } },
          { name: "kickoff_ts", type: "i64" },
          { name: "home_score", type: "u8" },
          { name: "away_score", type: "u8" },
          { name: "settled", type: "bool" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "Prediction",
      type: {
        kind: "struct",
        fields: [
          { name: "owner", type: "pubkey" },
          { name: "match_id", type: "u16" },
          { name: "home_score", type: "u8" },
          { name: "away_score", type: "u8" },
          { name: "predicted_at", type: "i64" },
          { name: "points", type: "u8" },
          { name: "settled", type: "bool" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "FanRegistered",
      type: {
        kind: "struct",
        fields: [
          { name: "owner", type: "pubkey" },
          { name: "team", type: { array: ["u8", 3] } },
          { name: "fan_since", type: "i64" },
        ],
      },
    },
    {
      name: "ChantPosted",
      type: {
        kind: "struct",
        fields: [
          { name: "author", type: "pubkey" },
          { name: "team", type: { array: ["u8", 3] } },
          { name: "text", type: "string" },
          { name: "match_id", type: "u16" },
          { name: "timestamp", type: "i64" },
        ],
      },
    },
    {
      name: "PredictionMade",
      type: {
        kind: "struct",
        fields: [
          { name: "owner", type: "pubkey" },
          { name: "match_id", type: "u16" },
          { name: "home_score", type: "u8" },
          { name: "away_score", type: "u8" },
        ],
      },
    },
    {
      name: "MatchResultPosted",
      type: {
        kind: "struct",
        fields: [
          { name: "match_id", type: "u16" },
          { name: "home", type: { array: ["u8", 3] } },
          { name: "away", type: { array: ["u8", 3] } },
          { name: "home_score", type: "u8" },
          { name: "away_score", type: "u8" },
        ],
      },
    },
  ],
} as const;
