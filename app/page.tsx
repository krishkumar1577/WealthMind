"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/utils";

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
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Load any saved search history or preferences
    const savedInput = getFromLocalStorage('wealthmind_last_search', '');
    if (savedInput) {
      setInputValue(savedInput);
    }
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

  const handleSendMessage = async () => {
    const prompt = inputValue.trim();
    
    if (!prompt) {
      toast.error("Please enter a prompt");
      inputRef.current?.focus();
      return;
    }

    if (prompt.length < 5) {
      toast.error("Prompt must be at least 5 characters");
      return;
    }

    setIsLoading(true);
    try {
      // Save search to localStorage for history
      saveToLocalStorage('wealthmind_last_search', prompt);
      
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 300));

      router.push(`/chat?prompt=${encodeURIComponent(prompt)}`);
    } catch (error) {
      toast.error("Failed to navigate to chat");
      setIsLoading(false);
    }
  };

  const handleCardClick = (cardTitle: string) => {
    let prompt = "";
    switch (cardTitle) {
      case "Tax Liability":
        prompt = "What is my current tax liability estimate for this year?";
        break;
      case "Transactions":
        prompt = "Show me recent transactions across all my accounts";
        break;
      case "Upload Files":
        router.push("/upload");
        return;
      case "Generate P&L":
        prompt = "Generate a P&L statement for my investments";
        break;
    }

    if (prompt) {
      setInputValue(prompt);
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  const handlePromptChipClick = (chip: string) => {
    setInputValue(chip);
    setTimeout(() => handleSendMessage(), 100);
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
          <button
            key={idx}
            onClick={() => handleCardClick(card.title)}
            disabled={isLoading}
            className="action-card bg-white/[0.02] p-8 h-56 flex flex-col justify-between hover:bg-white/[0.04] transition-colors disabled:opacity-50 cursor-pointer text-left"
          >
            <div>
              <span className="category-label">{card.category}</span>
              <h3 className="font-serif text-2xl mt-6">{card.title}</h3>
            </div>
            <p className="text-sm opacity-60 leading-relaxed font-light">
              {card.description}
            </p>
          </button>
        ))}
      </main>

      {/* BEGIN: Input Area */}
      <footer className="w-full max-w-7xl mx-auto px-6 pb-8">
        {/* Prompt Chips */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {PROMPT_CHIPS.map((chip, idx) => (
            <button 
              key={idx} 
              onClick={() => handlePromptChipClick(chip)}
              disabled={isLoading}
              className="prompt-chip disabled:opacity-50 cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-[56px] bg-white/[.04] border border-white/[.08] rounded-full pl-6 pr-14 text-[15px] placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
            placeholder={PLACEHOLDERS[placeholderIndex]}
            type="text"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="absolute right-2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/[.08] border border-white/10 flex items-center justify-center transition-colors disabled:opacity-50"
            aria-label="Send message"
          >
            <svg
              className="w-5 h-5 rotate-90 text-white/60"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </div>
      </footer>
      {/* END: Input Area */}
    </>
  );
}
