use anchor_lang::prelude::*;

declare_id!("EwCR98M9we9XSNpNA7jnSh9HKXdQWtZPonLdJZ6yM6Kc");

pub const MAX_CHANT_LEN: usize = 140;
pub const EXACT_SCORE_POINTS: u8 = 3;
pub const OUTCOME_POINTS: u8 = 1;

#[program]
pub mod twelfth_man {
    use super::*;

    /// One-time setup; the signer becomes the admin who can create matches
    /// and post results.
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.admin = ctx.accounts.admin.key();
        config.match_count = 0;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    /// Mint your on-chain Fan Card for a team. One card per wallet, because
    /// passion means commitment.
    pub fn register_fan(ctx: Context<RegisterFan>, team_code: String) -> Result<()> {
        let code = validate_team_code(&team_code)?;

        let team = &mut ctx.accounts.team_stats;
        if team.fan_count == 0 && team.chant_count == 0 {
            team.code = code;
            team.bump = ctx.bumps.team_stats;
        }
        team.fan_count += 1;

        let fan = &mut ctx.accounts.fan_card;
        fan.owner = ctx.accounts.owner.key();
        fan.team = code;
        fan.fan_since = Clock::get()?.unix_timestamp;
        fan.chant_count = 0;
        fan.points = 0;
        fan.bump = ctx.bumps.fan_card;

        emit!(FanRegistered {
            owner: fan.owner,
            team: code,
            fan_since: fan.fan_since,
        });
        Ok(())
    }

    /// Post a chant for your team. Tag a match id to make it a Moment
    /// (match_id 0 = general chant).
    pub fn post_chant(ctx: Context<PostChant>, text: String, match_id: u16) -> Result<()> {
        require!(!text.trim().is_empty(), FanPulseError::EmptyChant);
        require!(text.len() <= MAX_CHANT_LEN, FanPulseError::ChantTooLong);

        let fan = &mut ctx.accounts.fan_card;
        let chant = &mut ctx.accounts.chant;
        chant.author = ctx.accounts.owner.key();
        chant.team = fan.team;
        chant.text = text.clone();
        chant.match_id = match_id;
        chant.timestamp = Clock::get()?.unix_timestamp;

        fan.chant_count += 1;
        ctx.accounts.team_stats.chant_count += 1;

        emit!(ChantPosted {
            author: chant.author,
            team: chant.team,
            text,
            match_id,
            timestamp: chant.timestamp,
        });
        Ok(())
    }

    /// Admin: register a fixture. Ids start at 1 (0 is reserved for
    /// "no match" on chants).
    pub fn create_match(
        ctx: Context<CreateMatch>,
        id: u16,
        home: String,
        away: String,
        kickoff_ts: i64,
    ) -> Result<()> {
        require!(id > 0, FanPulseError::InvalidMatchId);
        let m = &mut ctx.accounts.match_account;
        m.id = id;
        m.home = validate_team_code(&home)?;
        m.away = validate_team_code(&away)?;
        m.kickoff_ts = kickoff_ts;
        m.settled = false;
        m.bump = ctx.bumps.match_account;
        ctx.accounts.config.match_count += 1;
        Ok(())
    }

    /// Admin: post the final score, opening the match for settlement.
    pub fn post_result(ctx: Context<PostResult>, home_score: u8, away_score: u8) -> Result<()> {
        let m = &mut ctx.accounts.match_account;
        require!(!m.settled, FanPulseError::MatchAlreadySettled);
        m.home_score = home_score;
        m.away_score = away_score;
        m.settled = true;

        emit!(MatchResultPosted {
            match_id: m.id,
            home: m.home,
            away: m.away,
            home_score,
            away_score,
        });
        Ok(())
    }

    /// Lock in your score prediction before kickoff. Immutable, and that's the
    /// point: bragging rights you can prove.
    pub fn predict(ctx: Context<Predict>, home_score: u8, away_score: u8) -> Result<()> {
        let m = &ctx.accounts.match_account;
        let now = Clock::get()?.unix_timestamp;
        require!(now < m.kickoff_ts, FanPulseError::PredictionClosed);

        let p = &mut ctx.accounts.prediction;
        p.owner = ctx.accounts.owner.key();
        p.match_id = m.id;
        p.home_score = home_score;
        p.away_score = away_score;
        p.predicted_at = now;
        p.settled = false;
        p.points = 0;
        p.bump = ctx.bumps.prediction;

        emit!(PredictionMade {
            owner: p.owner,
            match_id: m.id,
            home_score,
            away_score,
        });
        Ok(())
    }

    /// Permissionless crank: score a prediction once the result is in.
    /// Exact score = 3 pts, correct outcome = 1 pt. Points accrue to the fan
    /// and their team's leaderboard total.
    pub fn settle_prediction(ctx: Context<SettlePrediction>) -> Result<()> {
        let m = &ctx.accounts.match_account;
        require!(m.settled, FanPulseError::MatchNotSettled);

        let p = &mut ctx.accounts.prediction;
        require!(!p.settled, FanPulseError::PredictionAlreadySettled);

        let exact = p.home_score == m.home_score && p.away_score == m.away_score;
        let outcome_of = |h: u8, a: u8| h.cmp(&a);
        let outcome = outcome_of(p.home_score, p.away_score) == outcome_of(m.home_score, m.away_score);

        let points = if exact {
            EXACT_SCORE_POINTS
        } else if outcome {
            OUTCOME_POINTS
        } else {
            0
        };

        p.points = points;
        p.settled = true;
        ctx.accounts.fan_card.points += points as u32;
        ctx.accounts.team_stats.points += points as u64;
        Ok(())
    }
}

fn validate_team_code(code: &str) -> Result<[u8; 3]> {
    let bytes = code.as_bytes();
    require!(
        bytes.len() == 3 && bytes.iter().all(|b| b.is_ascii_uppercase()),
        FanPulseError::InvalidTeamCode
    );
    Ok([bytes[0], bytes[1], bytes[2]])
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = 8 + Config::INIT_SPACE, seeds = [b"config"], bump)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(team_code: String)]
pub struct RegisterFan<'info> {
    #[account(init, payer = owner, space = 8 + FanCard::INIT_SPACE, seeds = [b"fan", owner.key().as_ref()], bump)]
    pub fan_card: Account<'info, FanCard>,
    #[account(
        init_if_needed,
        payer = owner,
        space = 8 + TeamStats::INIT_SPACE,
        seeds = [b"team", team_code.as_bytes()],
        bump
    )]
    pub team_stats: Account<'info, TeamStats>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PostChant<'info> {
    #[account(mut, seeds = [b"fan", owner.key().as_ref()], bump = fan_card.bump, has_one = owner)]
    pub fan_card: Account<'info, FanCard>,
    #[account(mut, seeds = [b"team", fan_card.team.as_ref()], bump = team_stats.bump)]
    pub team_stats: Account<'info, TeamStats>,
    #[account(
        init,
        payer = owner,
        space = 8 + Chant::INIT_SPACE,
        seeds = [b"chant", fan_card.key().as_ref(), &fan_card.chant_count.to_le_bytes()],
        bump
    )]
    pub chant: Account<'info, Chant>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(id: u16)]
pub struct CreateMatch<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump, has_one = admin)]
    pub config: Account<'info, Config>,
    #[account(init, payer = admin, space = 8 + MatchAccount::INIT_SPACE, seeds = [b"match".as_ref(), &id.to_le_bytes()], bump)]
    pub match_account: Account<'info, MatchAccount>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PostResult<'info> {
    #[account(seeds = [b"config"], bump = config.bump, has_one = admin)]
    pub config: Account<'info, Config>,
    #[account(mut, seeds = [b"match".as_ref(), &match_account.id.to_le_bytes()], bump = match_account.bump)]
    pub match_account: Account<'info, MatchAccount>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct Predict<'info> {
    #[account(seeds = [b"match".as_ref(), &match_account.id.to_le_bytes()], bump = match_account.bump)]
    pub match_account: Account<'info, MatchAccount>,
    #[account(seeds = [b"fan", owner.key().as_ref()], bump = fan_card.bump, has_one = owner)]
    pub fan_card: Account<'info, FanCard>,
    #[account(
        init,
        payer = owner,
        space = 8 + Prediction::INIT_SPACE,
        seeds = [b"prediction", match_account.key().as_ref(), owner.key().as_ref()],
        bump
    )]
    pub prediction: Account<'info, Prediction>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettlePrediction<'info> {
    #[account(seeds = [b"match".as_ref(), &match_account.id.to_le_bytes()], bump = match_account.bump)]
    pub match_account: Account<'info, MatchAccount>,
    #[account(
        mut,
        seeds = [b"prediction", match_account.key().as_ref(), prediction.owner.as_ref()],
        bump = prediction.bump
    )]
    pub prediction: Account<'info, Prediction>,
    #[account(mut, seeds = [b"fan", prediction.owner.as_ref()], bump = fan_card.bump)]
    pub fan_card: Account<'info, FanCard>,
    #[account(mut, seeds = [b"team", fan_card.team.as_ref()], bump = team_stats.bump)]
    pub team_stats: Account<'info, TeamStats>,
}

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub admin: Pubkey,
    pub match_count: u16,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct FanCard {
    pub owner: Pubkey,
    pub team: [u8; 3],
    pub fan_since: i64,
    pub chant_count: u32,
    pub points: u32,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct TeamStats {
    pub code: [u8; 3],
    pub fan_count: u32,
    pub chant_count: u64,
    pub points: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Chant {
    pub author: Pubkey,
    pub team: [u8; 3],
    #[max_len(MAX_CHANT_LEN)]
    pub text: String,
    /// 0 = general chant; otherwise the match this Moment belongs to
    pub match_id: u16,
    pub timestamp: i64,
}

#[account]
#[derive(InitSpace)]
pub struct MatchAccount {
    pub id: u16,
    pub home: [u8; 3],
    pub away: [u8; 3],
    pub kickoff_ts: i64,
    pub home_score: u8,
    pub away_score: u8,
    pub settled: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Prediction {
    pub owner: Pubkey,
    pub match_id: u16,
    pub home_score: u8,
    pub away_score: u8,
    pub predicted_at: i64,
    pub points: u8,
    pub settled: bool,
    pub bump: u8,
}

#[event]
pub struct FanRegistered {
    pub owner: Pubkey,
    pub team: [u8; 3],
    pub fan_since: i64,
}

#[event]
pub struct ChantPosted {
    pub author: Pubkey,
    pub team: [u8; 3],
    pub text: String,
    pub match_id: u16,
    pub timestamp: i64,
}

#[event]
pub struct PredictionMade {
    pub owner: Pubkey,
    pub match_id: u16,
    pub home_score: u8,
    pub away_score: u8,
}

#[event]
pub struct MatchResultPosted {
    pub match_id: u16,
    pub home: [u8; 3],
    pub away: [u8; 3],
    pub home_score: u8,
    pub away_score: u8,
}

#[error_code]
pub enum FanPulseError {
    #[msg("Team code must be exactly 3 uppercase letters (e.g. ARG, BRA)")]
    InvalidTeamCode,
    #[msg("Chant cannot be empty")]
    EmptyChant,
    #[msg("Chant is longer than 140 characters")]
    ChantTooLong,
    #[msg("Match id must be greater than 0")]
    InvalidMatchId,
    #[msg("Kickoff has passed, predictions are closed")]
    PredictionClosed,
    #[msg("Result already posted for this match")]
    MatchAlreadySettled,
    #[msg("Result not posted yet")]
    MatchNotSettled,
    #[msg("Prediction already settled")]
    PredictionAlreadySettled,
}
