"use client";

import { useRouter } from "next/navigation";

export default function ReportPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-full bg-[#111110] text-white/90 antialiased selection:bg-emerald-700 selection:text-white overflow-hidden flex flex-col">
      {/* BEGIN: Top ActionBar */}
      <nav className="fixed top-0 w-full h-14 border-b border-white/[0.06] bg-[#111110]/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-white text-lg">✦</span>
          <span className="font-serif text-sm tracking-wider uppercase text-white/90">Wealthmind</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase text-white/60 hover:text-white transition-colors border border-emerald-700/40 rounded-sm">
            Download PDF
          </button>
          <button className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase text-white/40 hover:text-white transition-colors">
            Share Secure Link
          </button>
          <button className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase text-white/40 hover:text-white transition-colors">
            Save to Reports
          </button>
          <div className="h-4 w-[1px] bg-white/[0.06] mx-2"></div>
          <button
            onClick={() => router.back()}
            className="text-white/40 hover:text-white transition-colors text-xl p-1"
            title="Close"
          >
            ✕
          </button>
        </div>
      </nav>
      {/* END: Top ActionBar */}

      {/* BEGIN: Document Wrapper */}
      <main className="flex-1 overflow-y-auto hide-scrollbar w-full">
        <div className="w-full px-12 py-24 bg-[#161615] min-h-full">
          {/* BEGIN: Document Header */}
          <header className="mb-12">
            <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] mb-6">
              Wealthmind Financial Intelligence · Confidential
            </p>
            <h1 className="font-serif text-5xl leading-tight text-white/90 mb-4">
              Portfolio Allocation Analysis
            </h1>
            <p className="text-white/40 font-light text-sm tracking-tight">
              Prepared for Alex Miller · Private Client · February 2025
            </p>
            <div className="mt-8 border-b border-white/[0.08]"></div>
          </header>
          {/* END: Document Header */}

          {/* BEGIN: Executive Summary */}
          <section className="mb-14 p-6 bg-white/[0.03] border-l-2 border-emerald-700">
            <p className="text-sm leading-relaxed font-light text-white/80">
              Current market volatility suggests a strategic pivot toward defensive equities and high-yield fixed income. This report outlines your current risk exposure across international markets and provides a calibrated model for capital preservation through the 2025 fiscal year.
            </p>
          </section>
          {/* END: Executive Summary */}

          {/* BEGIN: Findings Section */}
          <section className="mb-12">
            <h3 className="text-[11px] text-white/40 uppercase tracking-[0.15em] mb-6">
              Findings
            </h3>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">
                  Net Worth Variance
                </span>
                <span className="font-mono text-lg">
                  <span className="bg-emerald-700/20 text-emerald-400 px-2 py-1 rounded-full text-sm">
                    +14.2%
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">
                  Unrealized Delta
                </span>
                <span className="font-mono text-lg">
                  <span className="bg-amber-900/20 text-amber-300 px-2 py-1 rounded-full text-sm">
                    -2.4%
                  </span>
                </span>
              </div>
            </div>

            {/* Allocation Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-3 px-2 text-[10px] text-white/40 uppercase tracking-[0.15em] font-medium">
                      Asset Class
                    </th>
                    <th className="py-3 px-2 text-[10px] text-white/40 uppercase tracking-[0.15em] font-medium">
                      Allocation
                    </th>
                    <th className="py-3 px-2 text-[10px] text-white/40 uppercase tracking-[0.15em] font-medium text-right">
                      Value (USD)
                    </th>
                  </tr>
                </thead>
                <tbody className="font-light">
                  <tr className="bg-white/[0.025]">
                    <td className="py-4 px-2 text-white/70">Equities - Large Cap</td>
                    <td className="py-4 px-2 font-mono text-xs">42.5%</td>
                    <td className="py-4 px-2 font-mono text-xs text-right">$4,250,000</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-2 text-white/70">Fixed Income - Sovereign</td>
                    <td className="py-4 px-2 font-mono text-xs">28.0%</td>
                    <td className="py-4 px-2 font-mono text-xs text-right">$2,800,000</td>
                  </tr>
                  <tr className="bg-white/[0.025]">
                    <td className="py-4 px-2 text-white/70">Private Equity / VC</td>
                    <td className="py-4 px-2 font-mono text-xs">15.5%</td>
                    <td className="py-4 px-2 font-mono text-xs text-right">$1,550,000</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-2 text-white/70">Liquid Assets / Cash</td>
                    <td className="py-4 px-2 font-mono text-xs">14.0%</td>
                    <td className="py-4 px-2 font-mono text-xs text-right">$1,400,000</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-emerald-700/40">
                    <td className="py-4 px-2 text-[10px] text-white/40 uppercase tracking-[0.15em] font-medium">
                      Total Portfolio
                    </td>
                    <td className="py-4 px-2"></td>
                    <td className="py-4 px-2 font-mono text-sm text-right text-emerald-400">
                      $10,000,000
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
          {/* END: Findings Section */}

          {/* BEGIN: Recommendations */}
          <section className="mb-12">
            <h3 className="text-[11px] text-white/40 uppercase tracking-[0.15em] mb-6">
              Recommended Actions
            </h3>
            <div className="space-y-8 border-l-2 border-amber-700 pl-6 py-2">
              <div className="group">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-emerald-400 mt-0.5 text-sm">01.</span>
                  <div>
                    <p className="text-[15px] text-white/90 font-medium">
                      Rebalance Equity Overweight
                    </p>
                    <p className="text-white/40 italic text-[13px] mt-1 font-light">
                      Reduce exposure to Tech-sector holdings by 400bps to mitigate concentration risk.
                    </p>
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-emerald-400 mt-0.5 text-sm">02.</span>
                  <div>
                    <p className="text-[15px] text-white/90 font-medium">
                      Tax-Loss Harvesting: Emerging Markets
                    </p>
                    <p className="text-white/40 italic text-[13px] mt-1 font-light">
                      Offset recent capital gains through strategic liquidation of underperforming EM ETF positions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-emerald-400 mt-0.5 text-sm">03.</span>
                  <div>
                    <p className="text-[15px] text-white/90 font-medium">
                      Increase Fixed Income Duration
                    </p>
                    <p className="text-white/40 italic text-[13px] mt-1 font-light">
                      Transition $500k from liquid cash into 5-year Treasury notes to lock in current yields.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* END: Recommendations */}

          {/* BEGIN: Document Footer */}
          <footer className="mt-20 pt-8 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40 tracking-tight">
            <div>Generated by Wealthmind AI</div>
            <div className="text-white/20">✦</div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-[0.15em]">
                Verify with your financial advisor
              </span>
              <span className="text-[9px] text-white/20 uppercase tracking-[0.15em]">
                Institutional Access · End-to-End Encryption Enabled
              </span>
            </div>
          </footer>
          {/* END: Document Footer */}
        </div>
      </main>
      {/* END: Document Wrapper */}
    </div>
  );
}
