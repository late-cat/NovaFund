#![allow(deprecated)]
#![allow(warnings)]
#![allow(warnings)]
#![no_std]
#![allow(unexpected_cfgs)]

use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, Vec};

// We import the campaign client so we can easily call its init function
mod campaign_contract {
    soroban_sdk::contractimport!(file = "../target/wasm32v1-none/release/campaign.wasm");
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    WasmHash,
    CampaignCount,
    Campaign(u32),
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
        env.storage().instance().set(&DataKey::CampaignCount, &0u32);
    }

    /// Deploys a new Campaign contract and initializes it.
    pub fn create_campaign(
        env: Env,
        creator: Address,
        token: Address,
        goal: i128,
        deadline: u64,
        salt: BytesN<32>,
        name: soroban_sdk::String,
        description: soroban_sdk::String,
        image_url: soroban_sdk::String,
    ) -> Address {
        creator.require_auth();

        let wasm_hash: BytesN<32> = env.storage().instance().get(&DataKey::WasmHash).unwrap();

        if goal <= 0 {
            panic!("goal must be positive");
        }
        if deadline <= env.ledger().timestamp() {
            panic!("deadline must be in the future");
        }

        // Deploy the new campaign contract
        let deployed_address = env.deployer().with_current_contract(salt).deploy(wasm_hash);

        // Initialize the new contract
        let campaign_client = campaign_contract::Client::new(&env, &deployed_address);
        campaign_client.init(
            &creator,
            &token,
            &goal,
            &deadline,
            &name,
            &description,
            &image_url,
        );

        // Store the new campaign address in our list
        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::CampaignCount)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::Campaign(count), &deployed_address);
        env.storage()
            .instance()
            .set(&DataKey::CampaignCount, &(count + 1));

        // Publish event
        env.events()
            .publish(("campaign_created", deployed_address.clone()), creator);

        deployed_address
    }

    /// Returns a paginated list of deployed campaigns.
    pub fn get_campaigns(env: Env, start: u32, limit: u32) -> Vec<Address> {
        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::CampaignCount)
            .unwrap_or(0);
        let mut campaigns: Vec<Address> = Vec::new(&env);

        let end = (start + limit).min(count);
        for i in start..end {
            if let Some(addr) = env.storage().instance().get(&DataKey::Campaign(i)) {
                campaigns.push_back(addr);
            }
        }
        campaigns
    }
}
