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
    assert_eq!(state.is_claimed, false);
}
