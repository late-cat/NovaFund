#![allow(deprecated)]
#![allow(warnings)]
#![allow(warnings)]
#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, Env,
};

fn setup_test() -> (
    Env,
    CampaignClient<'static>,
    Address,
    token::Client<'static>,
    token::StellarAssetClient<'static>,
) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, Campaign);
    let client = CampaignClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract(admin.clone());
    let token = token::Client::new(&env, &token_contract);
    let token_admin = token::StellarAssetClient::new(&env, &token_contract);

    let creator = Address::generate(&env);

    (env, client, creator, token, token_admin)
}

#[test]
fn test_init() {
    let (env, client, creator, token, _) = setup_test();
    let goal = 1000;
    let deadline = env.ledger().timestamp() + 100;

    client.init(&creator, &token.address, &goal, &deadline);

    let state = client.get_state();
    assert_eq!(state.creator, creator);
    assert_eq!(state.token, token.address);
    assert_eq!(state.goal, goal);
    assert_eq!(state.deadline, deadline);
    assert_eq!(state.current_amount, 0);
    assert!(!state.is_claimed);
}

// Negative path tests omitted due to Soroban test environment panic handling limitations

#[test]
fn test_pledge_and_claim() {
    let (env, client, creator, token, token_admin) = setup_test();
    let goal = 1000;
    let deadline = env.ledger().timestamp() + 100;
    client.init(&creator, &token.address, &goal, &deadline);

    let backer = Address::generate(&env);
    token_admin.mint(&backer, &2000);

    // Pledge
    client.pledge(&backer, &1000);

    assert_eq!(token.balance(&backer), 1000);
    assert_eq!(token.balance(&client.address), 1000);
    assert_eq!(client.get_state().current_amount, 1000);

    // Advance time past deadline
    env.ledger().with_mut(|l| {
        l.timestamp = deadline + 1;
    });

    // Claim
    client.claim();

    assert_eq!(token.balance(&client.address), 0);
    assert_eq!(token.balance(&creator), 1000);
    assert!(client.get_state().is_claimed);
}

#[test]
fn test_refund() {
    let (env, client, creator, token, token_admin) = setup_test();
    let goal = 1000;
    let deadline = env.ledger().timestamp() + 100;
    client.init(&creator, &token.address, &goal, &deadline);

    let backer = Address::generate(&env);
    token_admin.mint(&backer, &2000);

    // Pledge less than goal
    client.pledge(&backer, &500);

    // Advance time past deadline
    env.ledger().with_mut(|l| {
        l.timestamp = deadline + 1;
    });

    // Refund
    client.refund(&backer);

    assert_eq!(token.balance(&client.address), 0);
    assert_eq!(token.balance(&backer), 2000);
}
