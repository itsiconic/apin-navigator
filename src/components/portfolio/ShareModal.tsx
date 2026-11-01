"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Copy,
  ExternalLink,
  Share2,
  Linkedin,
  Twitter,
  Mail,
  MessageCircle,
  Send,
  Code2,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  fullName?: string;
  headline?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  username,
  fullName,
  headline,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [origin, setOrigin] = useState("http://localhost:3000");
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
    }
  }, []);

  const cleanUser = username && username.trim() ? encodeURIComponent(username.trim()) : "preview";
  const publicUrl = `${origin}/p/${cleanUser}`;
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="800" frameborder="0" style="border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15);" allowfullscreen></iframe>`;

  const displayName = fullName || username || "Engineer";
  const shareText = `Check out my verified engineering portfolio on APIN: ${displayName} — ${
    headline || "Academic Project & Internship Navigator"
  }`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(publicUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = publicUrl;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success("Portfolio link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyEmbed = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(embedCode);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = embedCode;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedEmbed(true);
      toast.success("Embed HTML snippet copied!");
      setTimeout(() => setCopiedEmbed(false), 2500);
    } catch {
      toast.error("Failed to copy embed code");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} • APIN Verified Portfolio`,
          text: shareText,
          url: publicUrl,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-4 w-4 text-sky-600" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        publicUrl
      )}`,
      color: "hover:bg-sky-50 border-sky-200",
    },
    {
      name: "X / Twitter",
      icon: <Twitter className="h-4 w-4 text-slate-800" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(publicUrl)}`,
      color: "hover:bg-slate-50 border-slate-200",
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-4 w-4 text-emerald-600" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText}\n${publicUrl}`
      )}`,
      color: "hover:bg-emerald-50 border-emerald-200",
    },
    {
      name: "Telegram",
      icon: <Send className="h-4 w-4 text-sky-500" />,
      url: `https://t.me/share/url?url=${encodeURIComponent(
        publicUrl
      )}&text=${encodeURIComponent(shareText)}`,
      color: "hover:bg-sky-50 border-sky-200",
    },
    {
      name: "Email",
      icon: <Mail className="h-4 w-4 text-amber-600" />,
      url: `mailto:?subject=${encodeURIComponent(
        `Portfolio Showcase: ${displayName}`
      )}&body=${encodeURIComponent(`${shareText}\n\nView here: ${publicUrl}`)}`,
      color: "hover:bg-amber-50 border-amber-200",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-surface-200 shadow-2xl p-6 rounded-2xl animate-scale-in z-50">
        <DialogHeader className="space-y-1.5 pb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-200 w-fit">
            <Sparkles className="h-3 w-3 text-primary-600" />
            Verified Recruiter Link
          </div>
          <DialogTitle className="text-xl font-extrabold text-surface-900 tracking-tight">
            Share Your 3D Portfolio
          </DialogTitle>
          <DialogDescription className="text-xs text-surface-500">
            Share your recruiter-ready 3D interactive portfolio with employers, mentors, or on your social profiles.
          </DialogDescription>
        </DialogHeader>

        {/* URL Box */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 bg-surface-50 p-1.5 rounded-xl border border-surface-200">
            <Input
              readOnly
              value={publicUrl}
              className="bg-transparent border-none text-xs font-mono text-surface-800 shadow-none focus-visible:ring-0 select-all"
            />
            <Button
              size="sm"
              variant={copied ? "default" : "marigold"}
              onClick={handleCopy}
              className="shrink-0 gap-1.5 text-xs font-bold transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-xs font-semibold border-surface-300 text-surface-700 hover:text-surface-950 cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open Live Showcase
              </Button>
            </a>

            {canNativeShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNativeShare}
                className="gap-1.5 text-xs font-medium border-surface-300 text-surface-700 cursor-pointer"
                title="Open device native share dialog"
              >
                <Smartphone className="h-3.5 w-3.5" />
                Device Share
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmbed(!showEmbed)}
              className="gap-1.5 text-xs font-medium border-surface-300 text-surface-600 cursor-pointer"
            >
              <Code2 className="h-3.5 w-3.5" />
              {showEmbed ? "Hide Embed" : "Embed Snippet"}
            </Button>
          </div>

          {/* Embed Snippet Area */}
          {showEmbed && (
            <div className="p-3 bg-surface-900 rounded-xl space-y-2 border border-surface-800 animate-fade-in">
              <div className="flex items-center justify-between text-[11px] text-surface-300">
                <span className="font-mono">Embed HTML Card:</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyEmbed}
                  className="h-6 px-2 text-[10px] text-accent-300 hover:text-accent-200 hover:bg-white/10"
                >
                  {copiedEmbed ? "Copied!" : "Copy Code"}
                </Button>
              </div>
              <textarea
                readOnly
                rows={3}
                value={embedCode}
                className="w-full bg-surface-950 text-accent-300 text-[11px] font-mono p-2 rounded-lg border border-surface-700 focus:outline-none resize-none select-all"
              />
            </div>
          )}

          {/* Social Share Grid */}
          <div className="pt-2">
            <label className="text-[11px] font-bold text-surface-500 uppercase tracking-wider block mb-2">
              Instant Social Broadcast
            </label>
            <div className="grid grid-cols-5 gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border bg-white transition-all hover:scale-105 shadow-xs cursor-pointer ${s.color}`}
                  title={`Share on ${s.name}`}
                >
                  {s.icon}
                  <span className="text-[10px] font-medium text-surface-600 mt-1 truncate max-w-full">
                    {s.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
