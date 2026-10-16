"use client";

import { useState, useRef, useEffect } from "react";
import { siteConfig } from "@/data/site";
import { projects } from "@/data/projects";
import { roadmap } from "@/data/roadmap";

/**
 * MacMessagesAI
 * -------------
 * macOS Messages / AI Assistant chat window matching the Messenger reference:
 *  - Interactive assistant preloaded with Rashmin's portfolio facts
 *  - Quick prompt pills for instant queries
 *  - Smooth chat bubbles and typing indicator
 */
export default function MacMessagesAI({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: "ai-welcome",
      sender: "ai",
      text: "Hey there! I'm Rashmin's AI assistant. Ask me anything about his projects, experience, tech stack, or roadmap!",
      timestamp: "Just now",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const getAIAnswer = (query) => {
    const q = query.toLowerCase();

    if (q.includes("project") || q.includes("built") || q.includes("work")) {
      const topProjects = projects.filter((p) => p.published && !p.dummy).slice(0, 3);
      const list = topProjects.map((p) => `• ${p.title} (${p.stack?.join(", ")})`).join("\n");
      return `Rashmin has built several production projects including:\n\n${list}\n\nYou can explore all of them by visiting the /projects section or clicking the laptop on the desk!`;
    }

    if (q.includes("stack") || q.includes("tech") || q.includes("languages") || q.includes("tools")) {
      return "Rashmin's primary stack includes Next.js, React, JavaScript/TypeScript, Tailwind CSS, Node.js, Python, and 3D WebGL (Three.js / React Three Fiber), along with hardware prototyping on Raspberry Pi.";
    }

    if (q.includes("who") || q.includes("about") || q.includes("rashmin")) {
      return `${siteConfig.name} is a ${siteConfig.role} based in ${siteConfig.location}. He builds useful software, explores AI and hardware, and is working toward founding his own product company.`;
    }

    if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("hire")) {
      return `You can reach Rashmin via the Contact page (/contact) or directly at rashminsharma47@gmail.com. You can also connect on LinkedIn: ${siteConfig.linkedin}`;
    }

    if (q.includes("roadmap") || q.includes("next") || q.includes("future")) {
      const current = roadmap?.find((r) => r.status === "now");
      return `Right now, Rashmin is focused on: "${current?.title || "3D Interactive Portfolio & Product Prototypes"}". Check out the /roadmap section or whiteboard for full details!`;
    }

    if (q.includes("desk") || q.includes("workshop") || q.includes("3d")) {
      return "The 3D desk behind this window represents Rashmin's workshop: every object corresponds to a real portfolio module (Laptop = Projects, Pi = Lab, Whiteboard = Roadmap, Book = Experience, Plant = About, Phone = Contact).";
    }

    return "That's a great question! Rashmin is always excited to collaborate on innovative software, developer tools, and product ideas. Feel free to send him a note via the Contact window!";
  };

  const handleSend = (userText) => {
    const text = (userText || inputVal).trim();
    if (!text) return;

    // Add user message
    const userMsg = {
      id: Math.random().toString(36).substring(2, 9),
      sender: "user",
      text,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate thoughtful typing response
    setTimeout(() => {
      const reply = getAIAnswer(text);
      const aiMsg = {
        id: Math.random().toString(36).substring(2, 9),
        sender: "ai",
        text: reply,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div
        className="w-full max-w-lg rounded-[14px] overflow-hidden border border-paper/15 shadow-2xl flex flex-col"
        style={{
          background: "rgba(15, 23, 42, 0.96)",
          height: "min(580px, 85vh)",
        }}
      >
        {/* Title Bar */}
        <div className="h-11 px-4 border-b border-paper/10 flex items-center justify-between select-none bg-night-surface/90 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center group"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-black/70">×</span>
            </button>
            <span className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>

          <div className="font-mono text-xs font-semibold text-paper flex items-center gap-2">
            <span className="text-board">●</span>
            <span>Rashmin AI — Assistant</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-muted hover:text-paper"
          >
            Esc
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-2.5 whitespace-pre-wrap leading-relaxed ${
                    isUser
                      ? "bg-cobalt text-white rounded-br-sm"
                      : "bg-paper/10 border border-paper/10 text-paper rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-muted mt-1 px-1">{m.timestamp}</span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-paper/10 rounded-lg text-muted text-xs w-20">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce [animation-delay:150ms]">●</span>
              <span className="animate-bounce [animation-delay:300ms]">●</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-paper/5 bg-night-surface/50 flex flex-wrap gap-1.5 shrink-0">
          {[
            "What has Rashmin built?",
            "What is his tech stack?",
            "How can I contact him?",
            "What is the 3D workshop?",
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-mono px-2 py-1 rounded bg-paper/5 hover:bg-paper/15 text-sky hover:text-signal transition-colors border border-paper/10"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-paper/10 flex items-center gap-2 bg-night-surface shrink-0"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Rashmin AI anything..."
            className="flex-1 bg-paper/5 border border-paper/10 rounded-lg px-3 py-2 font-mono text-xs text-paper placeholder:text-muted/50 focus:outline-none focus:border-signal"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-signal text-ink font-mono text-xs font-bold hover:opacity-90 active:scale-95 transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
