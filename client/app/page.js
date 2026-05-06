import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import { GoWorkflow } from "react-icons/go";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-white text-black overflow-hidden selection:bg-black/10">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <GoWorkflow className="text-white" size={18} />
          </div>
          <span className="font-mono tracking-tighter">0123</span>
        </div>
        <Link
          href="https://muapi.ai/access-keys"
          target="_blank"
          className="border border-black/10 hover:border-black/30 bg-white hover:bg-[#f5f5f5] px-5 py-2 rounded-full text-sm font-medium transition-all text-black/70 hover:text-black"
        >
          Get API Key
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-28 pb-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-black/50 text-xs font-semibold mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/40 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black/60"></span>
          </span>
          AI-Powered Workflow Pipelines
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-black leading-[1.08]">
          Build generative<br />
          <span className="text-black/40">AI pipelines visually.</span>
        </h1>

        <p className="text-lg md:text-xl text-black/50 mb-12 max-w-2xl leading-relaxed">
          0123 is a node-based AI workflow builder for generative image and video.
          Self-host it, extend it, own it — no subscriptions, no lock-in.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/workflow"
            className="group flex items-center gap-2 bg-black hover:bg-black/80 text-white px-8 py-4 rounded-full font-semibold transition-all text-sm shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.18)] active:scale-95"
          >
            Open Workflow Builder
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-4 rounded-full font-semibold text-black/40 hover:text-black hover:bg-black/5 transition-all text-sm">
            Watch Demo
          </button>
        </div>

        {/* UI Preview */}
        <div className="mt-20 w-full max-w-5xl rounded-2xl border border-black/8 bg-[#fafafa] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
          <div className="aspect-video rounded-xl bg-white border border-black/6 overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <GoWorkflow className="text-black/5" size={120} />
            </div>

            {/* Node card 1 */}
            <div className="absolute top-8 left-8 w-48 bg-white rounded-xl border border-black/8 p-4 shadow-sm">
              <div className="w-12 h-1.5 bg-black/20 rounded mb-2" />
              <div className="w-24 h-1.5 bg-black/10 rounded mb-4" />
              <div className="space-y-1.5">
                <div className="w-full h-1 bg-black/5 rounded" />
                <div className="w-full h-1 bg-black/5 rounded" />
                <div className="w-2/3 h-1 bg-black/5 rounded" />
              </div>
            </div>

            {/* Node card 2 */}
            <div className="absolute bottom-8 right-8 w-60 bg-white rounded-xl border border-black/8 p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="w-16 h-1.5 bg-black/20 rounded" />
                <div className="w-4 h-4 rounded-full bg-black/8" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square bg-black/4 rounded-lg" />
                <div className="aspect-square bg-black/4 rounded-lg" />
                <div className="aspect-square bg-black/4 rounded-lg" />
                <div className="aspect-square bg-black/4 rounded-lg" />
              </div>
            </div>

            {/* Connector line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <line x1="38%" y1="32%" x2="62%" y2="68%" stroke="#00000015" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-black/6 py-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-mono font-bold tracking-tighter text-black/30 text-sm">
            <GoWorkflow size={14} />
            0123
          </div>
          <div className="text-black/30 text-sm">
            Open-source · Self-hostable · MIT License
          </div>
        </div>
      </footer>
    </div>
  );
}
