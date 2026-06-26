#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_init() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Campaign);
    let client = CampaignClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let goal = 1000;
    let deadline = env.ledger().timestamp() + 100;

    client.init(&creator, &token, &goal, &deadline);

    let state = client.get_state();
    assert_eq!(state.creator, creator);
    assert_eq!(state.token, token);
    assert_eq!(state.goal, goal);
    assert_eq!(state.deadline, deadline);
    assert_eq!(state.current_amount, 0);
    assert!(!state.is_claimed);
}

#[test]
fn test_data_key_equality() {
    let env = Env::default();
    let addr = Address::generate(&env);
    let key1 = DataKey::Pledge(addr.clone());
    let key2 = DataKey::Pledge(addr);
    
    assert_eq!(key1, key2);
}

#[test]
fn test_campaign_state_creation() {
    let env = Env::default();
    let addr = Address::generate(&env);
    let token = Address::generate(&env);
    
    let state = CampaignState {
        creator: addr.clone(),
        token: token.clone(),
        goal: 100,
        deadline: 50,
        current_amount: 10,
        is_claimed: true,
    };
    
    assert_eq!(state.goal, 100);
    assert_eq!(state.current_amount, 10);
    assert!(state.is_claimed);
}
