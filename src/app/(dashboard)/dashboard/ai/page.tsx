"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  FolderKanban,
  ClipboardCheck,
  FileText,
  Briefcase,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";

interface SuggestedOption {
  label: string;
  description?: string;
  url?: string;
  action: "NAVIGATE" | "PROMPT";
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  suggestedOptions?: SuggestedOption[] | null;
  createdAt: string;
}

export default function AiAdvisorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const data = await api.get<ChatMessage[]>("/api/ai/chat");
      setMessages(data || []);
    } catch {
      toast.error("Failed to load AI conversation history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || sending) return;

    setSending(true);
    setInputValue("");

    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const reply = await api.post<ChatMessage>("/api/ai/chat", {
        message: text,
      });
      setMessages((prev) => [...prev, reply]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to receive AI response";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleOptionClick = (option: SuggestedOption) => {
    if (option.action === "NAVIGATE" && option.url) {
      router.push(option.url);
    } else {
      handleSendMessage(option.label);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-50 text-accent-700 border border-accent-200 mb-2 shadow-xs">
            <Sparkles className="h-3 w-3 text-accent-500" />
            <span>APIN AI Advisor • Academic Project &amp; Internship Navigator</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-600" />
            AI Career Advisor &amp; Interactive Decision Engine
          </h1>
          <p className="text-sm text-surface-500">
            Real-time evaluation of your profile, verified skills, and maker hobbies with guided multi-choice recommendations.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="border-surface-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
        {/* Messages Scroll Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    isUser
                      ? "bg-primary-800 text-white shadow-xs"
                      : "bg-gradient-to-br from-primary-800 to-primary-950 text-accent-400 border border-primary-700/60 shadow-xs"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message Body */}
                <div className={`space-y-3 max-w-[85%] sm:max-w-[78%]`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "bg-primary-900 text-white rounded-tr-xs shadow-sm"
                        : "bg-surface-100/90 text-surface-900 rounded-tl-xs border border-surface-200/80"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  {/* Interactive Options Cards (User's Exact Specification!) */}
                  {!isUser && msg.suggestedOptions && msg.suggestedOptions.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="h-3 w-3 text-accent-500" />
                        Select an option to proceed:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.suggestedOptions.map((opt, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleOptionClick(opt)}
                            className="card-interactive group p-3 rounded-xl border border-surface-200/90 bg-white/90 hover:border-primary-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                          >
                            <div>
                              <p className="font-semibold text-xs text-surface-900 group-hover:text-primary-800 transition-colors">
                                {opt.label}
                              </p>
                              {opt.description && (
                                <p className="text-[11px] text-surface-500 mt-1 line-clamp-2">
                                  {opt.description}
                                </p>
                              )}
                            </div>
                            <span className="text-[11px] font-bold text-primary-700 group-hover:text-accent-600 mt-2 flex items-center gap-1 transition-colors">
                              Execute Option
                              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {sending && (
            <div className="flex gap-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-800 to-primary-950 text-accent-400 border border-primary-700/60 shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-4 rounded-2xl bg-surface-100 text-surface-500 text-xs flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent-500 animate-ping" />
                Evaluating your profile & generating strategic options...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-surface-200 bg-surface-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything (e.g. 'What project should I do next?', 'Suggest internships for me')..."
              className="bg-white flex-1"
            />
            <Button type="submit" disabled={!inputValue.trim() || sending} className="gap-1.5 shrink-0">
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
