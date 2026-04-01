"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import toast from "react-hot-toast";
import katex from "katex";
import "katex/dist/katex.min.css";

export const dynamic = "force-dynamic";

// Enhanced markdown parser with formatting, tables, and LaTeX support
function parseMarkdown(text: string) {
  const elements: React.ReactNode[] = [];
  let keyCounter = 0;
  let remaining = text;

  // First, extract and process tables, block equations, and regular content
  const blockRegex = /(\|[\s\S]+?\|(?:\n\|[\s\S]+?\|)*)|(\$\$[\s\S]+?\$\$)|([\s\S]+?)(?=\||\$\$|$)/g;
  let blockMatch;

  while ((blockMatch = blockRegex.exec(remaining)) !== null) {
    if (blockMatch[1]) {
      // Table detected
      const tableHtml = renderTable(blockMatch[1]);
      elements.push(
        <div key={`table-${keyCounter++}`} dangerouslySetInnerHTML={{ __html: tableHtml }} />
      );
    } else if (blockMatch[2]) {
      // Block equation detected ($$...$$)
      const equation = blockMatch[2].slice(2, -2).trim();
      try {
        const html = katex.renderToString(equation, { displayMode: true });
        elements.push(
          <div
            key={`math-block-${keyCounter++}`}
            className="math-block"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (error) {
        console.warn('KaTeX render error:', error);
        elements.push(
          <div key={`math-error-${keyCounter++}`} className="text-red-400 text-sm">
            [Math Error: {(error as Error).message}]
          </div>
        );
      }
    } else if (blockMatch[3]) {
      // Regular content
      const content = blockMatch[3];
      const parsed = parseContent(content, keyCounter);
      elements.push(...parsed.elements);
      keyCounter = parsed.nextKey;
    }
  }

  return elements.length > 0 ? elements : parseContent(text, keyCounter).elements;
}

function parseContent(text: string, startKey: number): { elements: React.ReactNode[]; nextKey: number } {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let keyCounter = startKey;

  lines.forEach((line, idx) => {
    if (!line.trim()) {
      elements.push(<div key={`empty-${startKey}-${idx}`} className="h-2" />);
      return;
    }

    // Check if it's a bullet point
    const bulletMatch = line.match(/^\s*[\*\-]\s+(?:\*\*)?(.*)$/);
    const isBullet = !!bulletMatch;
    const contentLine = isBullet ? bulletMatch![1] : line;

    // Parse the line for bold, highlights, and inline equations
    const parsed = parseLine(contentLine, keyCounter);
    keyCounter = parsed.nextKey;

    if (isBullet) {
      elements.push(
        <div key={`bullet-${startKey}-${idx}`} className="flex gap-3 ml-4 mb-2">
          <span className="text-emerald-400 font-bold mt-0.5 flex-shrink-0">•</span>
          <p className="whitespace-pre-wrap break-words leading-relaxed">
            {parsed.content}
          </p>
        </div>
      );
    } else {
      elements.push(
        <p key={`para-${startKey}-${idx}`} className="whitespace-pre-wrap break-words leading-relaxed mb-2">
          {parsed.content}
        </p>
      );
    }
  });

  return { elements, nextKey: keyCounter };
}

function renderTable(tableText: string): string {
  const rows = tableText.split('\n').filter((row) => row.trim().startsWith('|'));
  
  let html = '<table>';
  let isHeader = true;

  rows.forEach((row) => {
    const cells = row.split('|').slice(1, -1).map((cell) => cell.trim());

    if (cells.length === 0) return;

    // Skip separator row (|---|---|)
    if (cells.every((cell) => /^-+$/.test(cell))) {
      isHeader = false;
      return;
    }

    const tag = isHeader ? 'th' : 'td';
    html += `<tr>${cells.map((cell) => `<${tag}>${escapeHtml(cell)}</${tag}>`).join('')}</tr>`;

    if (isHeader) {
      html += '';
      isHeader = false;
    }
  });

  html += '</table>';
  return html;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

interface ParseResult {
  content: React.ReactNode[];
  nextKey: number;
}

function parseLine(text: string, startKey: number): ParseResult {
  const parts: React.ReactNode[] = [];
  let key = startKey;
  let remaining = text;

  // First pass: extract bold sections and inline equations
  const segments: Array<{ type: 'bold' | 'math' | 'text'; content: string }> = [];
  const combinedRegex = /\*\*(.+?)\*\*|\$(?!\$)(.+?)\$(?!\$)/g;
  let lastPos = 0;
  let segmentMatch;

  while ((segmentMatch = combinedRegex.exec(remaining)) !== null) {
    if (segmentMatch.index > lastPos) {
      segments.push({ type: 'text', content: remaining.substring(lastPos, segmentMatch.index) });
    }
    if (segmentMatch[1]) {
      segments.push({ type: 'bold', content: segmentMatch[1] });
    } else if (segmentMatch[2]) {
      segments.push({ type: 'math', content: segmentMatch[2] });
    }
    lastPos = segmentMatch.index + segmentMatch[0].length;
  }

  if (lastPos < remaining.length) {
    segments.push({ type: 'text', content: remaining.substring(lastPos) });
  } else if (segments.length === 0) {
    segments.push({ type: 'text', content: remaining });
  }

  // Second pass: process segments
  segments.forEach((segment) => {
    if (segment.type === 'bold') {
      parts.push(
        <strong key={`bold-${key++}`} className="font-semibold text-white">
          {segment.content}
        </strong>
      );
    } else if (segment.type === 'math') {
      // Inline math equation
      try {
        const html = katex.renderToString(segment.content, { displayMode: false });
        parts.push(
          <span
            key={`math-${key++}`}
            className="math-inline"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (error) {
        console.warn('KaTeX inline render error:', error);
        parts.push(
          <span key={`math-error-${key++}`} className="text-red-300 text-xs">
            [Eq]
          </span>
        );
      }
    } else {
      // Highlight amounts, sections, acronyms
      const highlighted = highlightContent(segment.content, key);
      parts.push(...highlighted.parts);
      key = highlighted.nextKey;
    }
  });

  return { content: parts, nextKey: key };
}

interface HighlightResult {
  parts: React.ReactNode[];
  nextKey: number;
}

function highlightContent(text: string, startKey: number): HighlightResult {
  const parts: React.ReactNode[] = [];
  let key = startKey;

  // Define highlight patterns
  const patterns = [
    {
      name: 'currency',
      regex: /₹[\d,\.]+\s*(?:lakh|crore|lac)?/g,
      className: 'text-emerald-400 font-semibold',
    },
    {
      name: 'section',
      regex: /(?:Section|u\/s|Sec\.)\s*\d+[A-Z]*/g,
      className: 'text-emerald-400 font-semibold',
    },
    {
      name: 'percentage',
      regex: /\d+(?:\.\d+)?%/g,
      className: 'text-emerald-400 font-semibold',
    },
    {
      name: 'acronym',
      regex: /\b(?:PPF|EPF|ELSS|NPS|GST|ISC|FD|NSC|SSY|ITR|TDS|GSTR|ROC|MCA|CFO|SME)\b/g,
      className: 'text-emerald-300 font-semibold',
    },
  ];

  let lastIndex = 0;

  // Collect all matches from all patterns with their position and type
  interface Match {
    index: number;
    length: number;
    text: string;
    className: string;
  }

  const allMatches: Match[] = [];

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        text: match[0],
        className: pattern.className,
      });
    }
  });

  // Sort by index
  allMatches.sort((a, b) => a.index - b.index);

  // Remove duplicates/overlaps
  const cleanMatches: Match[] = [];
  let lastEnd = 0;
  allMatches.forEach((match) => {
    if (match.index >= lastEnd) {
      cleanMatches.push(match);
      lastEnd = match.index + match.length;
    }
  });

  // Build the output
  lastIndex = 0;
  cleanMatches.forEach((match) => {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <span key={`hl-${key++}`} className={match.className}>
        {match.text}
      </span>
    );
    lastIndex = match.index + match.length;
  });

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return { parts: parts.length > 0 ? parts : [text], nextKey: key };
}

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPrompt = searchParams.get("prompt") || "";
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // If there's an initial prompt from home, add it as the first message
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      const userMessage = { role: "user" as const, content: initialPrompt };
      setMessages([userMessage, { role: "ai", content: "..." }]);
      // Send to API immediately
      sendMessageToAPI(initialPrompt, [userMessage]);
    }
  }, [initialPrompt]);

  const sendMessageToAPI = async (message: string, currentMessages: Array<{ role: "user" | "ai"; content: string }>) => {
    try {
      setIsLoading(true);
      
      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      
      let fullResponse = '';
      let messageIndex = -1;
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversationHistory: currentMessages,
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      // Find the AI message index
      setMessages((prev) => {
        messageIndex = prev.length - 1;
        return prev;
      });

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                // Token-by-token typing effect
                for (const char of parsed.chunk) {
                  fullResponse += char;
                  
                  setMessages((prev) => {
                    const updated = [...prev];
                    if (messageIndex >= 0 && updated[messageIndex]?.role === "ai") {
                      updated[messageIndex] = { role: "ai", content: fullResponse };
                    }
                    return updated;
                  });
                  
                  // Small delay between tokens for smooth typing effect
                  await new Promise(resolve => setTimeout(resolve, 8));
                }
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (parseError) {
              if (!(parseError instanceof SyntaxError)) {
                console.error('Parse error:', parseError);
              }
            }
          }
        }
      }

      // Final cleanup
      setMessages((prev) => {
        const updated = [...prev];
        if (messageIndex >= 0 && updated[messageIndex]?.content === "...") {
          updated[messageIndex] = { role: "ai", content: fullResponse };
        }
        return updated;
      });

    } catch (error) {
      console.error("Chat error:", error);
      
      // Check if error is AbortError (user clicked stop)
      if (error instanceof Error && error.name === 'AbortError') {
        toast.success("✋ Response generation stopped");
        return;
      }
      
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      
      setMessages((prev) => prev.filter((msg) => msg.content !== "..."));
      
      if (errorMsg.includes("quota") || errorMsg.includes("429")) {
        toast.error("🔄 API quota exceeded. Try again after midnight!");
      } else if (!errorMsg.includes('AbortError')) {
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      toast.success("✋ Stopping response generation...");
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = { role: "user" as const, content: inputValue };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInputValue("");
      
      // Add loading indicator
      setMessages((prev) => [...prev, { role: "ai", content: "..." }]);
      
      await sendMessageToAPI(inputValue, newMessages);
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
        <div className="flex-1 overflow-y-auto px-6 pt-12 pb-0 scroll-smooth">
          <div className="max-w-2xl mx-auto space-y-8 pb-32">
            {messages.map((message, idx) =>
              message.role === "user" ? (
                // User Message
                <div key={`msg-${idx}-user-${message.content.substring(0, 10)}`} className="flex justify-end">
                  <div className="max-w-[65%] bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl rounded-br-[4px]">
                    <p className="text-[15px] font-light leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              ) : (
                // AI Response
                <div key={`msg-${idx}-ai-${message.content === "..." ? "loading" : "response"}`} className="flex flex-col space-y-4">
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
                  {/* Content - Better formatting for long responses */}
                  <div className="space-y-3 text-[14px] font-light leading-[1.8] text-white/85 max-w-3xl">
                    {message.content === "..." ? (
                      <p className="italic text-white/50">Processing your request...</p>
                    ) : (
                      <div>{parseMarkdown(message.content)}</div>
                    )}
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
        </div>
        </div>

        {/* Input Area - Fixed at bottom with smooth layering */}
        <div className="sticky bottom-0 left-0 right-0 flex flex-col z-20 bg-gradient-to-t from-wealth-black via-wealth-black/95 to-transparent backdrop-blur-sm pt-8 pb-6">
          {/* BEGIN: Input Area */}
          <div className="max-w-2xl mx-auto px-6 w-full">
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
              {isLoading ? (
                <button
                  onClick={handleStopGeneration}
                  className="absolute right-4 opacity-100 hover:opacity-75 cursor-pointer transition-opacity text-red-400"
                  title="Stop generation"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4z" clipRule="evenodd"></path>
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  className="absolute right-4 opacity-40 hover:opacity-100 cursor-pointer transition-opacity"
                  title="Send message"
                >
                  <svg
                    className="w-5 h-5 rotate-90"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              )}
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
