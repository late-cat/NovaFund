"use client";

import { useState } from "react";
import { TreePine, Calendar, Target, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toStroops } from "@/lib/stellar/utils";

export default function CreateCampaign() {
  const router = useRouter();
  const [txStatus, setTxStatus] = useState<"idle" | "signing" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    deadline: "",
    imageLink: "",
  });
  const [imageType, setImageType] = useState<"link" | "upload">("link");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxStatus("signing");

    try {
      const address = localStorage.getItem("connected_pubkey");
      if (!address) {
        alert("Please connect your wallet first via the top right button.");
        setTxStatus("idle");
        return;
      }
      
      let finalImageUrl = formData.imageLink;
      
      // Handle file upload if that option is selected
      if (imageType === "upload" && imageFile) {
        setTxStatus("submitting"); // Show uploading state
        try {
          const response = await fetch(
            `/api/upload?filename=${encodeURIComponent(imageFile.name)}`,
            {
              method: 'POST',
              body: imageFile,
            },
          );
          
          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }
          
          const blob = await response.json();
          finalImageUrl = blob.url;
          setTxStatus("signing"); // Back to signing state
        } catch (err) {
          console.error("Error uploading image:", err);
          alert("Failed to upload image. Please try using a link instead.");
          setTxStatus("error");
          return;
        }
      }

      if (!finalImageUrl) {
        alert("Please provide a cover image URL or upload a file.");
        setTxStatus("idle");
        return;
      }

      const { signTransactionWithKit } = await import("@/lib/wallet");
      const { getFactoryClient } = await import("@/lib/soroban");
      const client = getFactoryClient();

      const salt = new Uint8Array(32);
      crypto.getRandomValues(salt);

      const deadlineDate = new Date(formData.deadline);
      deadlineDate.setUTCHours(23, 59, 59, 999);
      const deadlineSecs = Math.floor(deadlineDate.getTime() / 1000);
      const goalAmount = toStroops(formData.goal);

      const { NATIVE_XLM_TESTNET } = await import("@/lib/constants");
      const tokenAddress = NATIVE_XLM_TESTNET;

      const tx = await client.create_campaign({
        creator: address,
        token: tokenAddress,
        goal: goalAmount,
        deadline: BigInt(deadlineSecs),
        salt: Buffer.from(salt),
        name: formData.title,
        description: formData.description,
        image_url: finalImageUrl,
      }, { publicKey: address });

      setTxStatus("submitting");
      const sentTx = await tx.signAndSend({ signTransaction: signTransactionWithKit });
      
      const newCampaignId = sentTx.result;
      console.log("Campaign created!", newCampaignId);
      
      setTimeout(() => {
        setTxStatus("success");
        router.push("/");
      }, 1500);
    } catch (e) {
      console.error(e);
      alert("Error deploying campaign: " + e);
      setTxStatus("error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <motion.div 
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 mb-4 shadow-sm text-orange-500">
            <TreePine size={24} />
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight text-gray-800">Start a Campaign</h1>
          <p className="text-gray-500 text-sm max-w-md">
            Deploy your idea to the Stellar testnet as an unstoppable Soroban smart contract.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/80 p-8 rounded-[2rem] shadow-sm border border-gray-100 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Campaign Title</label>
              <input
                id="title"
                required
                type="text"
                placeholder="e.g. Next-Gen Stellar Wallet"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm shadow-inner"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Description</label>
              <textarea
                id="description"
                required
                rows={4}
                placeholder="Describe what you are building..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all resize-none text-sm shadow-inner"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="goal" className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Funding Goal (XLM)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Target size={16} className="text-gray-500" />
                  </div>
                  <input
                    id="goal"
                    required
                    type="number"
                    min="1"
                    placeholder="10000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm shadow-inner"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="deadline" className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Deadline</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <input
                    id="deadline"
                    required
                    type="date"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm shadow-inner"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Cover Image</label>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setImageType("link")}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${imageType === "link" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    Paste Link
                  </button>
                  <button 
                    type="button"
                    onClick={() => setImageType("upload")}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${imageType === "upload" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    Upload File
                  </button>
                </div>
              </div>
              
              {imageType === "link" ? (
                <input
                  id="imageLink"
                  required
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm shadow-inner"
                  value={formData.imageLink}
                  onChange={(e) => setFormData({ ...formData, imageLink: e.target.value })}
                />
              ) : (
                <input
                  id="imageUpload"
                  required
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm shadow-inner"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={txStatus === "signing" || txStatus === "submitting"}
                className="sticky-note-btn relative w-full flex items-center justify-center gap-2 py-3.5 rounded-md font-bold transition-all text-sm border-none group bg-[#fdf5c9] text-[#e88147] hover:bg-[#fbf1bb] hover:-rotate-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 w-10 h-3.5 bg-white/50 border border-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm rotate-[2deg]" />
                {txStatus === "signing" || txStatus === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-[#e88147]" />
                    <span>{txStatus === "signing" ? "Please Sign in Wallet..." : "Deploying Smart Contract..."}</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Launch Campaign
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-gray-500 mt-3 font-medium">
                Deploying this contract will require a signature from your connected wallet.
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
