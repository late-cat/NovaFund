#![no_std]
#![allow(unexpected_cfgs)]

use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, Vec};

// We import the campaign client so we can easily call its init function
mod campaign_contract {
    soroban_sdk::contractimport!(file = "../target/wasm32-unknown-unknown/release/campaign.wasm");
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    WasmHash,
    Campaigns,
}

#[contract]
pub struct CampaignFactory;

#[contractimpl]
impl CampaignFactory {
    /// Initialize the factory with the WASM hash of the Campaign contract.
    pub fn init(env: Env, wasm_hash: BytesN<32>) {
        if env.storage().instance().has(&DataKey::WasmHash) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::WasmHash, &wasm_hash);

        let empty_campaigns: Vec<Address> = Vec::new(&env);
        env.storage()
            .instance()
            .set(&DataKey::Campaigns, &empty_campaigns);
    }

    /// Deploys a new Campaign contract and initializes it.
    pub fn create_campaign(
        env: Env,
        creator: Address,
        token: Address,
        goal: i128,
        deadline: u64,
        salt: BytesN<32>,
    ) -> Address {
        creator.require_auth();

        let wasm_hash: BytesN<32> = env.storage().instance().get(&DataKey::WasmHash).unwrap();

        // Deploy the new campaign contract
        let deployed_address = env.deployer().with_current_contract(salt).deploy(wasm_hash);

        // Initialize the new contract
        let campaign_client = campaign_contract::Client::new(&env, &deployed_address);
        campaign_client.init(&creator, &token, &goal, &deadline);

        // Store the new campaign address in our list
        let mut campaigns: Vec<Address> =
            env.storage().instance().get(&DataKey::Campaigns).unwrap();
        campaigns.push_back(deployed_address.clone());
        env.storage()
            .instance()
            .set(&DataKey::Campaigns, &campaigns);

        // Publish event
        env.events()
            .publish(("campaign_created", deployed_address.clone()), creator);

        deployed_address
    }

    /// Returns the list of all deployed campaigns.
    pub fn get_campaigns(env: Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&DataKey::Campaigns)
            .unwrap_or(Vec::new(&env))
    }
}
