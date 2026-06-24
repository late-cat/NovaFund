<div align="center">
  <h1 align="center">NovaFund</h1>
  <p align="center">
    <strong>Decentralized Crowdfunding Powered by Stellar Soroban Smart Contracts</strong>
  </p>
</div>

## Overview
NovaFund is a next-generation decentralized crowdfunding platform built on the Stellar network. It leverages the power of Soroban smart contracts to provide a trustless, transparent, and efficient way for creators to raise funds and for backers to support innovative projects.

## Features
- **Trustless Funding:** Funds are held in a smart contract and only released if the goal is met.
- **Automatic Refunds:** Backers can claim refunds if the campaign fails to reach its goal by the deadline.
- **Inter-Contract Communication:** A Factory contract dynamically deploys dedicated Campaign contracts on-chain.
- **Real-Time Events:** Listen to network events for new campaigns and pledges.
- **Premium UI:** Next.js and Tailwind CSS powered frontend with a gorgeous glassmorphism design.

## Architecture
- **Smart Contracts (Rust & Soroban):** Two main contracts form the core logic. The `CampaignFactory` deploys isolated `Campaign` instances.
- **Frontend (Next.js & React):** A modern UI using App Router, Tailwind CSS, and `lucide-react` for iconography.
- **Wallet Integration:** Connects seamlessly with the Freighter browser extension for signing transactions.
- **TypeScript Bindings:** Auto-generated TypeScript bindings link the React app to the deployed Soroban contracts.

## Smart Contracts
- **Factory Contract:** Responsible for maintaining a registry of campaigns and acting as an deployer (`create_campaign`) using `soroban_sdk::contractimport!`.
- **Campaign Contract:** Handles user pledges (`pledge`), fund claiming by the creator (`claim`), and refund claims by backers (`refund`). Each campaign operates autonomously with its own isolated state.
