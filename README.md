<div align="center">
  
# 🛡️ NovaFund

**A next-generation trustless crowdfunding platform powered by Soroban Smart Contracts on Stellar.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stellar](https://img.shields.io/badge/Network-Stellar_Testnet-black)](https://stellar.org/)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange)](https://soroban.stellar.org/)
[![CI/CD Pipeline Status](https://github.com/late-cat/NovaFund/actions/workflows/ci.yml/badge.svg)](https://github.com/late-cat/NovaFund/actions/workflows/ci.yml)

  <h3>🚀 Live Production Deployment: <a href="https://nova-fund.vercel.app/">https://nova-fund.vercel.app/</a></h3>
  <h3>🎥 Video Walkthrough: <a href="https://youtu.be/S9shZimBqp4">https://youtu.be/S9shZimBqp4</a></h3>

<img src="demo-img/hero.png" alt="NovaFund Hero" width="100%" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 20px;" />

*Launch your visionary projects with trustless, decentralized crowdfunding. Your backers securely pledge XLM natively on the Stellar Testnet with no middleman.*

</div>

---

## 🏆 Stellar Belt Challenge Submission Checklist

### 🟠 Level 3 - Orange Belt Submission

| Requirement | Status & Implementation Details |
| :--- | :--- |
| **Advanced Contracts** | ✅ Built bespoke `Factory` and `Campaign` contracts using Rust |
| **Inter-Contract Comm** | ✅ `Factory` securely cross-calls `Campaign` to deploy and index instances |
| **Event Streaming** | ✅ Frontend subscribes to Soroban RPC for real-time campaign states |
| **CI/CD Pipeline** | ✅ GitHub Actions runs Rust/Next.js tests and builds on PRs |
| **Deployment Workflow** | ✅ Automated Makefile scripts provided in documentation |
| **Mobile Responsive** | ✅ Complex grid layouts and forms perfectly optimized for mobile |
| **Error & Loading States** | ✅ Rich UX loading states and specifically handled contract error codes |
| **Testing Suite** | ✅ Jest frontend tests and Rust Soroban VM unit tests passing |
| **Production Architecture**| ✅ Built on Next.js App Router and dynamic metadata indexing |
| **Documentation** | ✅ Comprehensive README provided with context and diagrams |
| **Required Deliverables** | ✅ Video Demo, Mobile/CI screenshots, Contract IDs & Hash |

### 🟢 Level 4 - Green Belt Submission

| Requirement | Status & Implementation Details |
| :--- | :--- |
| **Production MVP** | ✅ Fully functional production-ready crowdfunding platform |
| **Mobile Responsive UI** | ✅ Built with Tailwind mobile-first utilities (`md:`, `lg:`) |
| **Loading States & Error Handling** | ✅ Global `loading.tsx` skeletons and Sentry `ErrorBoundary` |
| **User Onboarding** | ✅ Seamless wallet integration with detailed feedback mechanism |
| **User Feedback Collection** | ✅ Floating "Share Feedback" button integrated natively |
| **Production Deployment** | ✅ Next.js App Router deployed flawlessly on Vercel |
| **Monitoring & Analytics** | ✅ Vercel Analytics + Sentry for active crash/usage tracking |
| **Optimized UX** | ✅ High-performance Framer Motion animations |
| **Project Structure & Docs** | ✅ Modular Next.js 14 architecture with comprehensive README |
| **15+ Meaningful Commits** | ✅ 20+ meaningful semantic commits |

#### 📋 User Feedback & Onboarding Proof
*   **📝 User Feedback Google Form**: [Submit Feedback](#) *(Add link here)*
*   **📊 Feedback Responses Sheet**: [View Responses](#) *(Add link here)*

**Proof of 10+ Unique User Wallet Interactions:**
*(Insert screenshot of 10+ user Google sheet here: `![10+ Users Proof](./demo-img/10-user-proof.png)`)*

**Basic User Feedback Summary:**
*(Insert summary of 10+ user responses here after collecting feedback)*

#### 📈 Monitoring & Analytics
**Vercel Analytics Dashboard:**
*(Insert screenshot of Vercel Analytics here: `![Vercel Analytics](./demo-img/vercel-analytics.png)`)*

**Sentry Error Monitoring Dashboard:**
*(Insert screenshot of Sentry Error tracking here: `![Sentry Dashboard](./demo-img/sentry-dashboard.png)`)*

---

## 📖 Product Overview & Problem Statement

### The Problem
Traditional crowdfunding platforms (like Kickstarter or GoFundMe) act as centralized middlemen. They charge high percentage fees, hold funds hostage, and dictate what projects can be launched. Furthermore, backers must trust that the platform and creator will fulfill their promises without transparent on-chain guarantees.

### The Solution: NovaFund
NovaFund is a decentralized crowdfunding protocol built on Stellar Soroban:
- **Trustless Escrow**: Funds are locked in an immutable Soroban smart contract, not a corporate bank account.
- **Factory Pattern**: Creators can instantly spin up independent, isolated campaign contracts.
- **Zero Middleman Fees**: Because the platform operates purely on-chain, creators keep what they raise (minus standard Stellar transaction fees).
- **On-chain Pledging**: Backers pledge XLM natively, and if a campaign fails to reach its goal by the deadline, refunds are cryptographically guaranteed.
- **End-to-End Transparency**: Every transaction, pledge, and claim is verifiable on the Stellar block explorer.

---

## 🏗️ Architecture & Smart Contract Design

### High-Level System Architecture

```mermaid
graph TD
    User([Creator / Backer]) -->|Interacts| UI[Next.js Frontend]
    UI -->|Connects Wallet| SWK[Freighter API]
    UI -->|Reads/Submits Txs| RPC[Soroban RPC]
    
    subgraph Stellar Network [Stellar Testnet]
        RPC -->|Invokes| ContractA[Factory Contract]
        ContractA -->|Deploys & Tracks| ContractB[Campaign Contract Instances]
    end
```

### Smart Contract Execution Sequence

NovaFund utilizes two distinct Soroban smart contracts to enforce dynamic deployment and robust security:

1. **Factory Contract**: An indexed registry that dynamically deploys and tracks all campaign contracts for scalable O(1) lookups and pagination.
2. **Campaign Contract**: Manages individual crowdfunding campaigns, handling pledges, state updates (Active, Successful, Failed), and refunds/claims.

**Inter-Contract Communication Flow:**
```mermaid
sequenceDiagram
    participant UI as Next.js Frontend
    participant Factory as Factory Contract
    participant Campaign as Campaign Contract
    
    UI->>Factory: create_campaign(target, deadline)
    activate Factory
    Factory->>Factory: Deploy Wasm Hash
    Factory->>Campaign: init(target, deadline, creator)
    activate Campaign
    Campaign-->>Factory: success (bool)
    deactivate Campaign
    Factory->>Factory: Emit `CAMPAIGN_CREATED` Event
    Factory-->>UI: Transaction Confirmed
    deactivate Factory
```

---

## 🚀 Features & Tech Stack

**Frontend Layer**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + fluid, heavily stylized components
- **State Management**: React Hooks + local caching
- **Components**: Lucide Icons + Framer Motion for micro-animations
- **Wallet Integration**: Stellar Freighter API integration
- **Analytics & Monitoring**: Vercel Analytics + Sentry Error Tracking

**Blockchain & Backend Layer**
- **Smart Contracts**: Rust (Soroban SDK)
- **Network**: Stellar Testnet
- **Contract Pattern**: Factory & Independent Campaign Instances
- **Math**: BigInt math for precise XLM conversion

---

## 📁 Project Directory Structure

```text
stellar-crowdfund/
├── src/
│   ├── app/           # Next.js App Router pages and global CSS
│   ├── components/    # Reusable UI elements (Navbar, Cards, Wallet Connect, Feedback)
│   └── lib/           # Soroban TS client bindings and Stellar utilities
├── contracts/         # Soroban Rust smart contract source code (factory, campaign)
└── package.json       # Project dependencies and scripts
```

## 📜 Smart Contract Information

| Property | Value |
| :--- | :--- |
| **Network** | Stellar Testnet |
| **Factory Contract Address** | `CBGNLTWENII3LYUUVFU7DKCXV4HQTEKJQEUWXJKVIMVNMQL7E2DP2MEM` |
| **Environment** | Soroban Environment |

---

## 🛠️ Local Setup Instructions

To run this application locally, ensure you have Node.js (v18+) installed, then execute:

```bash
# Install all dependencies
npm install

# Start the development server
npm run dev
```
Navigate to `http://localhost:3000` to interact with the application.

---

## 📸 Visual Walkthrough

### Exploring Ongoing Campaigns
<img src="demo-img/all-ongoing-campaign.png" alt="Explore Campaigns" width="100%" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 20px;" />

### Starting a New Campaign
<img src="demo-img/start a campagin.png" alt="Start Campaign" width="100%" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 20px;" />

### Pledging and Confirming Transaction
<img src="demo-img/confirm-transaction from user.png" alt="Confirm Transaction" width="100%" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 20px;" />
<img src="demo-img/funding.png" alt="Funding Progress" width="100%" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 20px;" />

### On-Chain Transaction Success
<img src="demo-img/successfull-transac.png" alt="Transaction Success Explorer" width="100%" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 20px;" />

### Mobile Responsive UI
<img src="demo-img/mobile-respons.png" alt="Mobile Responsive Design" width="100%" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 20px;" />

### CI/CD Pipeline & Automated Testing
<img src="demo-img/final-pipeline.png" alt="CI/CD Pipeline" width="100%" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 20px;" />
<img src="demo-img/final-tests.png" alt="Passing Tests" width="100%" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 20px;" />

---

<div align="center">
  <b>Developed with ⚔️ by Bapi Mondal</b><br>
  <a href="https://github.com/bapix-star">GitHub Profile</a>
</div>
