import { ShieldCheck, Target, ArrowRight, Zap, Coins, Rocket } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto py-12 md:py-16 px-4 md:px-0">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
          Trustless Crowdfunding
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          NovaFund connects visionary builders with aligned participants, unleashing the full power of decentralized capital markets on the Stellar Network.
        </p>
      </div>

      <div className="space-y-16">
        {/* For Participants */}
        <section className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
          
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Coins className="text-orange-500" /> For Participants
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg mb-2">01</div>
              <h3 className="text-lg font-bold text-gray-900">Browse & Pledge</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Explore live campaigns on the platform. When you find a project you believe in, pledge XLM securely via your stellar wallet. Your funds are locked in an audited Soroban smart contract, not held by the founders.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg mb-2">02</div>
              <h3 className="text-lg font-bold text-gray-900">Guaranteed Refunds</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                If the campaign does not hit its funding goal by the deadline, or if it gets cancelled by the creator, you can instantly claim a full refund. No rug pulls, guaranteed by code.
              </p>
            </div>
          </div>
        </section>

        {/* For Founders */}
        <section className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2" />
          
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Rocket className="text-blue-500" /> For Founders
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mb-2">01</div>
              <h3 className="text-lg font-bold text-gray-900">Permissionless Launch</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Create your campaign in seconds. Set your funding goal and deadline, and immediately start accepting XLM from backers worldwide without dealing with intermediaries or high fees.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mb-2">02</div>
              <h3 className="text-lg font-bold text-gray-900">Receive Capital</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Once your campaign successfully reaches its funding goal, you can instantly claim the raised XLM. The smart contract ensures a fair and transparent transition of funds.
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Mechanics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <ShieldCheck className="text-gray-600 mb-4" size={28} />
            <h3 className="text-base font-bold text-gray-900 mb-2">On-Chain Transparency</h3>
            <p className="text-sm text-gray-500">Every pledge and withdrawal is publicly verifiable on the Stellar ledger.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <Target className="text-gray-600 mb-4" size={28} />
            <h3 className="text-base font-bold text-gray-900 mb-2">All or Nothing</h3>
            <p className="text-sm text-gray-500">Campaigns only succeed if they hit 100% of their goal, protecting early backers.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <Zap className="text-gray-600 mb-4" size={28} />
            <h3 className="text-base font-bold text-gray-900 mb-2">Soroban Powered</h3>
            <p className="text-sm text-gray-500">Built entirely on Stellar&apos;s new WebAssembly smart contract platform.</p>
          </div>
        </section>

        <div className="text-center pt-8">
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm"
          >
            Start Your Campaign <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
