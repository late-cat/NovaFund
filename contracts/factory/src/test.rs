#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, BytesN, Env};

#[test]
fn test_factory_create() {
    let env = Env::default();
    
    // Register the factory contract
    let factory_id = env.register_contract(None, CampaignFactory);
    let factory_client = CampaignFactoryClient::new(&env, &factory_id);

    // Upload the campaign WASM
    let wasm_hash = env.deployer().upload_contract_wasm(campaign_contract::WASM);

    // Initialize factory
    factory_client.init(&wasm_hash);

    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let goal = 1000;
    let deadline = env.ledger().timestamp() + 100;
    
    let mut salt_bytes = [0u8; 32];
    salt_bytes[0] = 1;
    let salt = BytesN::from_array(&env, &salt_bytes);

    let campaign_id = factory_client.create_campaign(&creator, &token, &goal, &deadline, &salt);
    
    let campaigns = factory_client.get_campaigns();
    assert_eq!(campaigns.len(), 1);
    assert_eq!(campaigns.get(0).unwrap(), campaign_id);
}
