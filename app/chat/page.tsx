"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";

export const dynamic = "force-dynamic";

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPrompt = searchParams.get("prompt") || "";
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([
    {
      role: "user",
      content:
        "Analyze my current portfolio allocation and identify any over-exposure in the tech sector versus my risk parameters for 2025. Also, break down the quarterly expense projections.",
    },
    {
      role: "ai",
      content:
        "Based on the latest consolidated data from your custodians, your tech exposure currently stands at 32.4%. This exceeds your defined 2025 mandate of 25.0% by a margin of 7.4%.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // If there's an initial prompt from home, add it as the first message
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      setMessages([{ role: "user", content: initialPrompt }]);
    }
  }, [initialPrompt]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: "user", content: inputValue }]);
      setInputValue("");
      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "I'm processing your request. This is a placeholder response.",
          },
        ]);
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden flex bg-wealth-black text-wealth-off-white">
      {/* BEGIN: Sidebar */}
      <aside className="w-64 h-full border-r border-white/[0.05] flex flex-col z-10 bg-wealth-black">
        {/* Brand Header */}
        <div className="p-6 pb-8 flex items-center gap-3 border-b border-white/[0.05]">
          <div className="w-6 h-6 text-white opacity-80">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"></path>
            </svg>
          </div>
          <h1 className="font-serif text-xl tracking-tight">Wealthmind</h1>
        </div>

        {/* New Session Action */}
        <div className="px-4 py-4">
          <button
            onClick={() => router.push("/")}
            className="w-full border border-white/10 py-2 text-[10px] tracking-[0.3em] uppercase font-light hover:bg-white/5 transition-colors bg-transparent rounded"
          >
            New Session
          </button>
        </div>

        {/* Session History */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-white/40 px-4 mb-3">
            Recent Sessions
          </div>
          <a
            href="#"
            className="group relative flex items-center px-4 py-2 text-xs text-white/60 hover:text-white transition-colors border-l-2 border-transparent hover:border-white/20 block"
          >
            Tax Exposure Review · Feb 2025
          </a>
          <a
            href="#"
            className="group relative flex items-center px-4 py-2 text-xs text-white bg-white/5 border-l-2 border-accent-emerald block"
          >
            Portfolio Allocation Analysis
          </a>
          <a
            href="#"
            className="group relative flex items-center px-4 py-2 text-xs text-white/60 hover:text-white transition-colors border-l-2 border-transparent hover:border-white/20 block"
          >
            Q3 Cash Flow · Oct 2024
          </a>
          <a
            href="#"
            className="group relative flex items-center px-4 py-2 text-xs text-white/60 hover:text-white transition-colors border-l-2 border-transparent hover:border-white/20 block"
          >
            Trust Structuring Notes
          </a>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-[10px] uppercase font-medium">
              AM
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium">Alex Miller</span>
              <span className="text-[9px] uppercase tracking-tighter text-white/40">
                Private Client
              </span>
            </div>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 border border-emerald-800/50 bg-emerald-950/30 text-emerald-400 font-bold tracking-tighter rounded">
            PRO
          </span>
        </div>
      </aside>
      {/* END: Sidebar */}

      {/* BEGIN: Main Chat View */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-6 pt-12 pb-32">
          <div className="max-w-2xl mx-auto space-y-8">
            {messages.map((message, idx) =>
              message.role === "user" ? (
                // User Message
                <div key={idx} className="flex justify-end">
                  <div className="max-w-[65%] bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl rounded-br-[4px]">
                    <p className="text-[15px] font-light leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              ) : (
                // AI Response
                <div key={idx} className="flex flex-col space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-2 opacity-60">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"></path>
                    </svg>
                    <span className="text-[11px] tracking-[0.2em] font-medium uppercase">
                      Wealthmind
                    </span>
                  </div>
                  {/* Content */}
                  <div className="space-y-4 text-[15px] font-light leading-[1.8] text-white/90">
                    <p>{message.content}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-wealth-black via-wealth-black to-transparent pt-12 pb-8">

        {/* BEGIN: Input Area */}
          <div className="max-w-2xl mx-auto px-6">
            {/* Suggestion Chips */}
            <div className="flex gap-3 mb-4 justify-center flex-wrap">
              <button 
                onClick={() => router.push("/report")}
                className="px-4 py-1.5 rounded-full border border-white/10 text-[11px] font-medium text-white/60 hover:border-white/30 hover:text-white transition-all bg-white/[0.02]"
              >
                Export as PDF
              </button>
              <button className="px-4 py-1.5 rounded-full border border-white/10 text-[11px] font-medium text-white/60 hover:border-white/30 hover:text-white transition-all bg-white/[0.02]">
                View Execution Plan
              </button>
              <button className="px-4 py-1.5 rounded-full border border-white/10 text-[11px] font-medium text-white/60 hover:border-white/30 hover:text-white transition-all bg-white/[0.02]">
                Simulate Tax Impact
              </button>
            </div>

            {/* Input Bar */}
            <div className="relative flex items-center mb-3">
              <button 
                onClick={() => router.push("/upload")}
                className="absolute left-4 opacity-40 hover:opacity-100 cursor-pointer transition-opacity"
                title="Upload documents"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  ></path>
                </svg>
              </button>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-[52px] bg-white/[0.05] border border-white/10 rounded-full pl-12 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 placeholder:text-white/20 transition-all"
                placeholder="Direct your inquiry to Wealthmind..."
                type="text"
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-4 opacity-40 hover:opacity-100 cursor-pointer transition-opacity"
              >
                <svg
                  className="w-5 h-5 rotate-90"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>

            {/* Footer Text */}
            <div className="text-center">
              <span className="text-[9px] text-white/20 uppercase tracking-[0.15em]">
                Institutional Access · End-to-End Encryption Enabled
              </span>
            </div>
          </div>
        </div>
        {/* END: Input Area */}
      </main>
      {/* END: Main Chat View */}
    </div>
  );
}

function ChatPageWrapper() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-wealth-black flex items-center justify-center text-wealth-off-white">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}

export default ChatPageWrapper;
