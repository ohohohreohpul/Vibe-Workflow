"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { GoWorkflow } from "react-icons/go";
import { HiArrowLeft, HiCheck } from "react-icons/hi2";
import { toast } from "react-hot-toast";

const PACKS = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: "$9",
    perCredit: "$0.09",
    description: "20 workflow runs",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 500,
    price: "$39",
    perCredit: "$0.08",
    description: "100 workflow runs",
    highlight: true,
  },
  {
    id: "studio",
    name: "Studio",
    credits: 1500,
    price: "$99",
    perCredit: "$0.07",
    description: "300 workflow runs",
    highlight: false,
  },
];

export default function BillingPage() {
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [credits, setCredits] = useState(null);
  const [loadingPack, setLoadingPack] = useState(null);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Credits added to your account!");
      router.replace("/billing");
    }
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const token = await getToken();
      const res = await axios.get("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredits(res.data.credits);
    } catch {}
  };

  const handlePurchase = async (packId) => {
    setLoadingPack(packId);
    try {
      const token = await getToken();
      const res = await axios.post(
        "/api/billing/checkout",
        { pack: packId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.url;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Something went wrong");
      setLoadingPack(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-black/6 px-8 py-5 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
            <GoWorkflow className="text-white" size={15} />
          </div>
          <span className="font-mono font-bold tracking-tighter">0123</span>
        </div>
        <Link
          href="/workflow"
          className="flex items-center gap-1.5 text-sm text-black/40 hover:text-black transition-colors font-medium"
        >
          <HiArrowLeft size={14} />
          Back to workflows
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-black tracking-tight mb-3">Credits</h1>
          <p className="text-black/40 text-lg">
            You have{" "}
            <span className="font-black text-black">
              {credits === null ? "—" : credits.toLocaleString()}
            </span>{" "}
            credits remaining
          </p>
        </div>

        {/* Credit cost reference */}
        <div className="mb-12 flex justify-center gap-8 text-sm text-black/40">
          <span><span className="font-bold text-black">10 credits</span> — workflow run</span>
          <span><span className="font-bold text-black">5 credits</span> — single node run</span>
        </div>

        {/* Packs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`relative rounded-2xl p-8 border transition-all ${
                pack.highlight
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black/10 hover:border-black/30"
              }`}
            >
              {pack.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-black/10">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <p className={`text-xs font-black uppercase tracking-widest mb-3 ${pack.highlight ? "text-white/50" : "text-black/40"}`}>
                  {pack.name}
                </p>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl font-black">{pack.price}</span>
                </div>
                <p className={`text-sm ${pack.highlight ? "text-white/50" : "text-black/40"}`}>
                  {pack.perCredit} per credit
                </p>
              </div>

              <div className="mb-8 space-y-2.5">
                <div className={`flex items-center gap-2.5 text-sm font-medium ${pack.highlight ? "text-white/80" : "text-black/70"}`}>
                  <HiCheck className={pack.highlight ? "text-white" : "text-black"} size={16} />
                  {pack.credits.toLocaleString()} credits
                </div>
                <div className={`flex items-center gap-2.5 text-sm font-medium ${pack.highlight ? "text-white/80" : "text-black/70"}`}>
                  <HiCheck className={pack.highlight ? "text-white" : "text-black"} size={16} />
                  {pack.description}
                </div>
                <div className={`flex items-center gap-2.5 text-sm font-medium ${pack.highlight ? "text-white/80" : "text-black/70"}`}>
                  <HiCheck className={pack.highlight ? "text-white" : "text-black"} size={16} />
                  Never expires
                </div>
              </div>

              <button
                onClick={() => handlePurchase(pack.id)}
                disabled={loadingPack !== null}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 active:scale-95 ${
                  pack.highlight
                    ? "bg-white text-black hover:bg-zinc-100"
                    : "bg-black text-white hover:bg-zinc-800"
                }`}
              >
                {loadingPack === pack.id ? "Redirecting..." : `Get ${pack.credits} credits`}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-black/30 text-sm mt-10">
          Payments processed securely by Stripe. Credits are non-refundable.
        </p>
      </main>
    </div>
  );
}
