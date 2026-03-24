"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

type ReportData = {
  title?: string;
  clientName?: string;
  date?: string;
  sections?: Array<{
    title: string;
    content: string;
  }>;
};

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const generateReport = async () => {
      try {
        setIsLoading(true);
        
        // Sample data to pass to the report generator
        const reportData = {
          clientName: "Alex Miller",
          portfolioValue: 2500000,
          yearToDateReturn: 14.2,
          unrealizedDeltaPercent: -2.4,
          techExposurePercent: 32.4,
          targetTechExposure: 25.0,
          netLiquidWorth: 5200000,
          positions: [
            { asset: "Technology Equities", allocation: 32.4 },
            { asset: "Fixed Income", allocation: 28.5 },
            { asset: "Alternative Investments", allocation: 22.1 },
            { asset: "Cash & Equivalents", allocation: 17.0 },
          ],
          recommendations: [
            "Rebalance technology exposure to align with 25% target",
            "Consider tax-loss harvesting opportunities",
            "Review quarterly expense projections",
          ],
        };

        const response = await fetch("/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reportData),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate report: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setReport({
            title: "Portfolio Allocation Analysis",
            clientName: reportData.clientName,
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            sections: [
              {
                title: "Executive Summary",
                content: data.report,
              },
            ],
          });
        } else {
          throw new Error(data.error || "Failed to generate report");
        }
      } catch (error) {
        console.error("Report generation error:", error);
        toast.error("Failed to generate report");
        // Set a default report structure as fallback
        setReport({
          title: "Portfolio Allocation Analysis",
          clientName: "Alex Miller",
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          sections: [
            {
              title: "Executive Summary",
              content:
                "Current market volatility suggests a strategic pivot toward defensive equities and high-yield fixed income. This report outlines your current risk exposure across international markets and provides a calibrated model for capital preservation through the 2025 fiscal year.",
            },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateReport();
  }, []);

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      toast.success("PDF download started");
      // In a real app, you'd generate and download a PDF here
      // For now, we'll just simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to download PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareLink = () => {
    toast.success("Secure share link copied to clipboard");
  };

  const handleSaveToReports = () => {
    toast.success("Report saved to your reports library");
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#111110] text-white/90 antialiased selection:bg-emerald-700 selection:text-white overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">✦</div>
          <p className="text-white/60">Generating your report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#111110] text-white/90 antialiased selection:bg-emerald-700 selection:text-white overflow-hidden flex flex-col">
      {/* BEGIN: Top ActionBar */}
      <nav className="fixed top-0 w-full h-14 border-b border-white/[0.06] bg-[#111110]/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-white text-lg">✦</span>
          <span className="font-serif text-sm tracking-wider uppercase text-white/90">
            Wealthmind
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase text-white/60 hover:text-white transition-colors border border-emerald-700/40 rounded-sm disabled:opacity-50"
          >
            {isExporting ? "Exporting..." : "Download PDF"}
          </button>
          <button
            onClick={handleShareLink}
            className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase text-white/40 hover:text-white transition-colors"
          >
            Share Secure Link
          </button>
          <button
            onClick={handleSaveToReports}
            className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase text-white/40 hover:text-white transition-colors"
          >
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
              {report?.title || "Report"}
            </h1>
            <p className="text-white/40 font-light text-sm tracking-tight">
              Prepared for {report?.clientName} · Private Client · {report?.date}
            </p>
            <div className="mt-8 border-b border-white/[0.08]"></div>
          </header>
          {/* END: Document Header */}

          {/* BEGIN: Report Content */}
          {report?.sections && report.sections.length > 0 ? (
            report.sections.map((section, idx) => (
              <section key={idx} className="mb-14">
                <h2 className="text-[11px] text-white/40 uppercase tracking-[0.15em] mb-6">
                  {section.title}
                </h2>

                {/* Section Content */}
                <div className="space-y-6 text-sm leading-relaxed font-light text-white/80">
                  <p>{section.content}</p>
                </div>
              </section>
            ))
          ) : null}

          {/* BEGIN: Key Metrics */}
          <section className="mb-14 p-6 bg-white/[0.03] border-l-2 border-emerald-700">
            <h3 className="text-[11px] text-white/40 uppercase tracking-[0.15em] mb-6">
              Key Performance Indicators
            </h3>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">
                  Year-to-Date Return
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
          </section>
          {/* END: Key Metrics */}

          {/* BEGIN: Recommendations */}
          <section className="mb-14">
            <h3 className="text-[11px] text-white/40 uppercase tracking-[0.15em] mb-6">
              Recommendations
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg">
                <p className="text-sm text-white/80 leading-relaxed">
                  Rebalance technology exposure to align with your 25% target allocation. Current exposure at 32.4% presents both concentration risk and tax optimization opportunities.
                </p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg">
                <p className="text-sm text-white/80 leading-relaxed">
                  Consider tax-loss harvesting strategies across underperforming positions to offset gains realized elsewhere in your portfolio.
                </p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg">
                <p className="text-sm text-white/80 leading-relaxed">
                  Review quarterly expense projections against actual spending. Current pace suggests year-end variance of ±8% from forecast.
                </p>
              </div>
            </div>
          </section>
          {/* END: Recommendations */}

          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-white/[0.08] text-[9px] text-white/30">
            <p>
              This report is confidential and prepared solely for the private use of the named recipient(s). It should not
              be reproduced, redistributed, or used for any purpose without written consent.
            </p>
          </footer>
        </div>
      </main>
      {/* END: Document Wrapper */}
    </div>
  );
}
