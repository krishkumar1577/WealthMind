"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const PLACEHOLDERS = [
  "What's my tax exposure if I exit TSLA this quarter?",
  "Summarize my Q3 cash flow against last year.",
  "Analyze potential tax savings for charitable remainder trusts.",
  "What is my current net liquid worth across all entities?",
];

const FEATURE_CARDS = [
  {
    category: "Forecasting",
    title: "Tax Liability",
    description: "Real-time estimation of current year exposure and deductions.",
  },
  {
    category: "Insights",
    title: "Transactions",
    description: "Deep dive into capital flows across linked institutional accounts.",
  },
  {
    category: "Operations",
    title: "Upload Files",
    description: "Automated OCR processing for K-1s, receipts, and invoices.",
  },
  {
    category: "Reporting",
    title: "Generate P&L",
    description: "Prepare investment performance and profit/loss statements.",
  },
];

const PROMPT_CHIPS = [
  "Flag unusual transactions",
  "Q3 cash flow summary",
  "Am I audit-ready?",
];

export default function Home() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setFadeOut(false);
      }, 800);
    }, 5000);

    return () => clearInterval(interval);
  }, [mounted]);

  const handleSendMessage = () => {
    const prompt = inputValue.trim();
    if (prompt) {
      router.push(`/chat?prompt=${encodeURIComponent(prompt)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* BEGIN: Top Zone (Greeting) */}
      <header className="w-full flex flex-col items-center text-center mb-20 mt-20">
        {/* Spark Icon */}
        <div className="mb-4 opacity-40">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 5L22.5 17.5L35 20L22.5 22.5L20 35L17.5 22.5L5 20L17.5 17.5L20 5Z"
              fill="#f0ece4"
            />
          </svg>
        </div>

        {/* Greeting Heading */}
        <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight leading-tight">
          How can I assist your wealth <br />
          today, Alex?
        </h1>

        {/* Tagline */}
        <p className="category-label mt-6">Your private financial intelligence layer</p>
      </header>
      {/* END: Top Zone */}

      {/* BEGIN: Middle Zone (Action Cards) */}
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
        {FEATURE_CARDS.map((card, idx) => (
          <div
            key={idx}
            className="action-card bg-white/[0.02] p-8 h-56 flex flex-col justify-between"
          >
            <div>
              <span className="category-label">{card.category}</span>
              <h3 className="font-serif text-2xl mt-6">{card.title}</h3>
            </div>
            <p className="text-sm opacity-60 leading-relaxed font-light">
              {card.description}
            </p>
          </div>
        ))}
      </main>

      {/* Prompt Chips */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {PROMPT_CHIPS.map((chip, idx) => (
          <button key={idx} className="prompt-chip">
            {chip}
          </button>
        ))}
      </div>
      {/* END: Middle Zone */}

      {/* BEGIN: Bottom Zone (Input Bar & Profile) */}
      <footer className="relative w-full flex flex-col items-center">
        {/* Profile Badge (Absolute Bottom Left) */}
        <div
          className="absolute bottom-0 left-0 flex items-center gap-3"
          data-purpose="user-profile"
        >
          <div className="w-10 h-10 rounded-full border border-white/[0.05] flex items-center justify-center bg-white/5 font-serif italic text-xs">
            AM
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-light">Alex Miller</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="bg-wealth-emerald text-[10px] tracking-widest px-1.5 py-0.5 rounded flex items-center gap-1 font-medium text-foreground">
                <svg
                  className="w-2 h-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Central Pill Input */}
        <div className="pill-input-container w-full max-w-2xl bg-white/5 border border-white/[0.05] rounded-full flex items-center px-6 py-4 mb-2">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none focus:ring-0 w-full text-lg font-light placeholder:opacity-30 outline-none"
            placeholder="Inquire about your holdings..."
            type="text"
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "#1a4d38" }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="#f0ece4"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 10l7-7m0 0l7 7m-7-7v18"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {/* Rotating Helper Text */}
        <div className="h-6 overflow-hidden">
          <p
            className={`text-xs font-light opacity-30 italic placeholder-fade ${
              fadeOut ? "opacity-0" : "opacity-30"
            }`}
          >
            "{PLACEHOLDERS[placeholderIndex]}"
          </p>
        </div>
      </footer>
      {/* END: Bottom Zone */}
    </>
  );
}
