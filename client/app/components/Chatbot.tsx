"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { chatWithAI } from "@/app/lib/api";
import { cn } from "@/app/lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import ReactMarkdown from "react-markdown";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "bot" | "system";
  content: string;
}

const PROMPT_LIMIT = 30;

const getInitialMessage = (name?: string): Message => ({
  role: "bot",
  content: name 
    ? `Hello ${name}! I'm your Dosro Bazar assistant. How can I help you today?`
    : "Hello! I'm your Dosro Bazar assistant. How can I help you today?",
});

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([getInitialMessage(user?.username)]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const userId = user?.id || "guest";
  const username = user?.username;
  const storageKey = `remarket_chat_history_${userId}`;

  // Load history from localStorage when user status changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { messages: Message[]; count: number };
        setMessages(parsed.messages);
        setPromptCount(parsed.count);
      } else {
        setMessages([getInitialMessage(username)]);
        setPromptCount(0);
      }
    } catch {
      setMessages([getInitialMessage(username)]);
      setPromptCount(0);
    }
  }, [userId, username, storageKey]);

  // Save to localStorage whenever messages or count change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ messages, count: promptCount }));
    } catch {
      // Storage quota exceeded or unavailable — fail silently
    }
  }, [messages, promptCount, storageKey]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Close chatbot window for unauthenticated users (keeps floating action button visible)
  useEffect(() => {
    if (!user) {
      setIsOpen(false);
    }
  }, [user]);

  // Don't render inside the Admin portal
  if (pathname?.startsWith("/admin")) return null;

  const clearHistory = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setMessages([getInitialMessage(username)]);
    setPromptCount(0);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Check limit before sending
    const newCount = promptCount + 1;
    if (newCount > PROMPT_LIMIT) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        {
          role: "system",
          content: `You've reached the ${PROMPT_LIMIT}-message limit. Starting a fresh conversation.`,
        },
      ]);
      // Brief delay so user can see the notice, then reset
      setTimeout(() => clearHistory(), 1500);
      return;
    }

    setPromptCount(newCount);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Build history for backend (all prior turns except initial greeting and system messages)
    const history = messages
      .filter((m) => m.role !== "system")
      .slice(1) // skip initial greeting
      .map((m) => ({
        role: (m.role === "bot" ? "assistant" : "user") as "assistant" | "user",
        content: m.content,
      }));

    try {
      const response = await chatWithAI(userMessage, history, username);
      if (response.success) {
        setMessages((prev) => [...prev, { role: "bot", content: response.data }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Sorry, I encountered an error. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, I'm having trouble connecting right now." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingPrompts = PROMPT_LIMIT - promptCount;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Dosro Bazar Assistant</h3>
                <p className="text-[10px] opacity-80">
                  {remainingPrompts <= 5
                    ? `${remainingPrompts} message${remainingPrompts !== 1 ? "s" : ""} remaining`
                    : "Online & ready to help"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/10 h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>

          {/* Messages Container */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20"
          >
            {messages.map((msg, i) => {
              if (msg.role === "system") {
                return (
                  <div key={i} className="flex items-center gap-2 justify-center">
                    <AlertCircle size={14} className="text-amber-500 shrink-0" />
                    <p className="text-[11px] text-center text-muted-foreground italic">
                      {msg.content}
                    </p>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className={cn(
                    "flex gap-2 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                      msg.role === "user"
                        ? "bg-secondary"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none prose prose-sm dark:prose-invert max-w-none break-words"
                    )}
                  >
                    {msg.role === "bot" ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} />
                </div>
                <div className="bg-muted p-3 rounded-2xl rounded-tl-none text-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 bg-muted border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
              <Button
                size="icon"
                className="rounded-full h-9 w-9 shrink-0"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              Powered by Dosro Bazar AI · {promptCount}/{PROMPT_LIMIT} messages used
            </p>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
          isOpen
            ? "rotate-90 bg-muted text-foreground hover:bg-muted"
            : "bg-primary text-primary-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </Button>
    </div>
  );
}
