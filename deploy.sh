#!/bin/bash
set -e

echo "Building contracts..."
cd contracts
cargo build --target wasm32v1-none --release
cargo build -p campaign --target wasm32v1-none --release

echo "Installing Campaign WASM..."
CAMPAIGN_WASM_HASH=$(stellar contract install \
  --wasm target/wasm32v1-none/release/campaign.wasm \
  --source default \
  --network testnet)
echo "Campaign WASM Hash: $CAMPAIGN_WASM_HASH"

echo "Deploying Factory Contract..."
FACTORY_ADDRESS=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/factory.wasm \
  --source default \
  --network testnet)
echo "Factory Address: $FACTORY_ADDRESS"

echo "Initializing Factory Contract..."
stellar contract invoke \
  --id $FACTORY_ADDRESS \
  --source default \
  --network testnet \
  -- \
  init \
  --wasm_hash $CAMPAIGN_WASM_HASH

echo "Generating TypeScript bindings for Factory..."
cd ..
stellar contract bindings typescript \
  --network testnet \
  --id $FACTORY_ADDRESS \
  --output-dir src/lib/stellar/factory \
  --overwrite

echo "Generating TypeScript bindings for Campaign..."
# We use the WASM file directly to generate the types for campaigns
stellar contract bindings typescript \
  --network testnet \
  --wasm contracts/target/wasm32v1-none/release/campaign.wasm \
  --output-dir src/lib/stellar/campaign \
  --overwrite

echo "Deployment complete! Factory Address: $FACTORY_ADDRESS"
