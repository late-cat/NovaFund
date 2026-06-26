#![no_std]
#![allow(unexpected_cfgs)]

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    State,           // CampaignState
    Pledge(Address), // Amount pledged by an address
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CampaignState {
    pub creator: Address,
    pub token: Address,
    pub goal: i128,
    pub deadline: u64,
    pub current_amount: i128,
    pub is_claimed: bool,
}

#[contract]
pub struct Campaign;

#[contractimpl]
impl Campaign {
    /// Initializes the campaign. Can only be called once.
    pub fn init(env: Env, creator: Address, token: Address, goal: i128, deadline: u64) {
        if env.storage().instance().has(&DataKey::State) {
            panic!("already initialized");
        }

        let state = CampaignState {
            creator,
            token,
            goal,
            deadline,
            current_amount: 0,
            is_claimed: false,
        };

        env.storage().instance().set(&DataKey::State, &state);
    }

    /// Backers call this to pledge tokens to the campaign.
    pub fn pledge(env: Env, backer: Address, amount: i128) {
        backer.require_auth();

        let mut state: CampaignState = env.storage().instance().get(&DataKey::State).unwrap();

        if env.ledger().timestamp() > state.deadline {
            panic!("campaign deadline has passed");
        }
        if amount <= 0 {
            panic!("pledge amount must be positive");
        }

        // Transfer tokens from backer to this contract
        let token_client = token::Client::new(&env, &state.token);
        token_client.transfer(&backer, &env.current_contract_address(), &amount);

        // Update state
        state.current_amount += amount;
        env.storage().instance().set(&DataKey::State, &state);

        // Update individual pledge
        let pledge_key = DataKey::Pledge(backer.clone());
        let mut current_pledge: i128 = env.storage().persistent().get(&pledge_key).unwrap_or(0);
        current_pledge += amount;
        env.storage().persistent().set(&pledge_key, &current_pledge);

        // Publish event
        env.events().publish(("pledge", backer), amount);
    }

    /// If the campaign succeeds, the creator calls this to claim funds.
    pub fn claim(env: Env) {
        let mut state: CampaignState = env.storage().instance().get(&DataKey::State).unwrap();

        state.creator.require_auth();

        if env.ledger().timestamp() <= state.deadline {
            panic!("campaign still active");
        }
        if state.current_amount < state.goal {
            panic!("funding goal not reached");
        }
        if state.is_claimed {
            panic!("funds already claimed");
        }

        state.is_claimed = true;
        env.storage().instance().set(&DataKey::State, &state);

        let token_client = token::Client::new(&env, &state.token);
        token_client.transfer(
            &env.current_contract_address(),
            &state.creator,
            &state.current_amount,
        );

        env.events()
            .publish(("claim", state.creator.clone()), state.current_amount);
    }

    /// If the campaign fails, backers call this to refund their pledges.
    pub fn refund(env: Env, backer: Address) {
        let state: CampaignState = env.storage().instance().get(&DataKey::State).unwrap();

        if env.ledger().timestamp() <= state.deadline {
            panic!("campaign still active");
        }
        if state.current_amount >= state.goal {
            panic!("campaign succeeded, no refunds");
        }

        let pledge_key = DataKey::Pledge(backer.clone());
        let amount: i128 = env.storage().persistent().get(&pledge_key).unwrap_or(0);

        if amount == 0 {
            panic!("no pledge found or already refunded");
        }

        // Reset pledge first to prevent re-entrancy
        env.storage().persistent().set(&pledge_key, &0i128);

        let token_client = token::Client::new(&env, &state.token);
        token_client.transfer(&env.current_contract_address(), &backer, &amount);

        env.events().publish(("refund", backer), amount);
    }

    /// Get current state of the campaign
    pub fn get_state(env: Env) -> CampaignState {
        env.storage().instance().get(&DataKey::State).unwrap()
    }
}

mod test;
