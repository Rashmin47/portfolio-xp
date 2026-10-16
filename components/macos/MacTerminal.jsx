"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * MacTerminal
 * -----------
 * Authentic macOS Terminal interface matching the provided reference:
 *  - Titlebar: rashmin — zsh
 *  - Greeting: Last login: [timestamp] on ttys001
 *  - Styled prompts: rashmin@studio ~ % [command]
 *  - Interactive command parser with autocomplete & quick chips
 *  - Blinking block cursor
 */
export default function MacTerminal({
  projects = [],
  siteConfig = {},
  latestCommit = null,
  children = null,
}) {
  const router = useRouter();
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState([
    {
      id: "init-1",
      cmd: "whoami",
      // The homepage's single H1: plain, server-rendered, name + role + place.
      output: (
        <h1 className="text-chrome-text/90 pl-1 font-mono text-sm font-normal">
          {siteConfig.name || "Rashmin Sharma"}
          <span className="text-chrome-text/65 block text-xs mt-0.5">
            {siteConfig.role || "Software Developer"} · {siteConfig.location || "Kathmandu, Nepal"}
          </span>
        </h1>
      ),
    },
    {
      id: "init-2",
      cmd: "ls ~/work",
      output: (
        <div className="flex flex-wrap gap-x-6 gap-y-2 pl-1 py-1 font-mono text-sm">
          <Link href="/projects" className="text-accent-sky hover:underline decoration-signal">
            projects/
          </Link>
          <Link href="/lab" className="text-accent-sky hover:underline decoration-signal">
            experiments/
          </Link>
          <Link href="/experience" className="text-accent-sky hover:underline decoration-signal">
            experience/
          </Link>
          <Link href="/notes" className="text-accent-sky hover:underline decoration-signal">
            notes/
          </Link>
          <Link href="/about" className="text-accent-sky hover:underline decoration-signal">
            about/
          </Link>
          <Link href="/contact" className="text-accent-sky hover:underline decoration-signal">
            contact/
          </Link>
        </div>
      ),
    },
    {
      id: "init-3",
      cmd: "cat about.txt",
      output: (
        <div className="text-chrome-text/80 pl-1 font-mono text-sm leading-relaxed max-w-xl">
          {siteConfig.hero?.tagline && (
            <p className="font-semibold text-chrome-text mb-1">{siteConfig.hero.tagline}</p>
          )}
          <p>{siteConfig.hero?.support || "Developer, curious builder, and problem-solver. I build useful software, explore ideas, and learn by shipping."}</p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const executeCommand = (cmdText) => {
    const raw = cmdText.trim();
    if (!raw) return;

    const parts = raw.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    let result = null;

    switch (command) {
      case "help":
        result = (
          <div className="space-y-1 font-mono text-xs text-chrome-text/80 pl-1">
            <p><span className="text-accent-signal font-bold">whoami</span> — Display author information</p>
            <p><span className="text-accent-signal font-bold">ls</span> — List all directories and sections</p>
            <p><span className="text-accent-signal font-bold">cat about.txt</span> — Display bio and mission</p>
            <p><span className="text-accent-signal font-bold">open [page]</span> — Navigate to projects, lab, notes, about, or contact</p>
            <p><span className="text-accent-signal font-bold">status</span> — Check current building focus & latest git commit</p>
            <p><span className="text-accent-signal font-bold">projects</span> — View published projects list</p>
            <p><span className="text-accent-signal font-bold">clear</span> — Clear terminal output</p>
          </div>
        );
        break;

      case "whoami":
        result = (
          <div className="font-mono text-sm text-chrome-text/90 pl-1">
            <p className="font-bold text-chrome-text">{siteConfig.name}</p>
            <p className="text-chrome-text/65 text-xs">{siteConfig.role} · {siteConfig.location}</p>
          </div>
        );
        break;

      case "ls":
        result = (
          <div className="flex flex-wrap gap-x-6 gap-y-1 pl-1 font-mono text-sm">
            <Link href="/projects" className="text-accent-sky hover:underline">projects/</Link>
            <Link href="/lab" className="text-accent-sky hover:underline">experiments/</Link>
            <Link href="/experience" className="text-accent-sky hover:underline">experience/</Link>
            <Link href="/notes" className="text-accent-sky hover:underline">notes/</Link>
            <Link href="/about" className="text-accent-sky hover:underline">about/</Link>
            <Link href="/contact" className="text-accent-sky hover:underline">contact/</Link>
          </div>
        );
        break;

      case "cat":
        if (args.includes("about")) {
          result = (
            <div className="text-chrome-text/80 pl-1 font-mono text-sm leading-relaxed">
              <p className="font-semibold text-chrome-text mb-1">{siteConfig.hero?.tagline}</p>
              <p>{siteConfig.hero?.support}</p>
            </div>
          );
        } else {
          result = <p className="text-chrome-text/65 text-xs pl-1 font-mono">cat: {args || "file"}: No such file</p>;
        }
        break;

      case "open":
      case "cd":
        {
          const target = args.replace("/", "").toLowerCase();
          if (["projects", "lab", "notes", "experience", "about", "contact", "roadmap"].includes(target)) {
            result = <p className="text-accent-board text-xs pl-1 font-mono">Opening /{target}...</p>;
            router.push(`/${target}`);
          } else {
            result = <p className="text-chrome-text/65 text-xs pl-1 font-mono">open: target not found: {args}</p>;
          }
        }
        break;

      case "projects":
        result = (
          <div className="space-y-1.5 pl-1 font-mono text-sm">
            {projects.slice(0, 4).map((p, idx) => (
              <div key={p.slug || idx} className="flex items-center gap-4">
                <span className="text-accent-signal font-bold text-xs">{String(idx + 1).padStart(2, "0")}</span>
                <Link href={`/projects/${p.slug}`} className="text-accent-sky hover:underline">
                  {p.title}
                </Link>
                <span className="text-chrome-text/65 text-xs hidden sm:inline">
                  {p.stack?.slice(0, 2).join(" · ")}
                </span>
              </div>
            ))}
            <div className="pt-1">
              <Link href="/projects" className="text-xs text-accent-signal hover:underline">
                → View all projects
              </Link>
            </div>
          </div>
        );
        break;

      case "status":
        result = (
          <div className="font-mono text-xs pl-1 space-y-1">
            <p className="text-chrome-text/90">
              <span className="text-chrome-text/65">Building now:</span> {siteConfig.building?.[0] || "Interactive 3D Workspace"}
            </p>
            {latestCommit && (
              <p className="text-chrome-text/90">
                <span className="text-chrome-text/65">Latest commit:</span> {latestCommit.sha} - {latestCommit.message} ({latestCommit.relativeDate})
              </p>
            )}
            <p className="text-chrome-text/65">Location: {siteConfig.location}</p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        return;

      default:
        result = (
          <p className="text-chrome-text/65 text-xs pl-1 font-mono">
            zsh: command not found: {command}. Type <span className="text-accent-signal font-bold">help</span> for commands.
          </p>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        cmd: raw,
        output: result,
      },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className="p-4 sm:p-6 font-mono text-chrome-text flex-1 flex flex-col justify-between">
      {/* ── Terminal Header Info ────────────────────────────────────── */}
      <div className="space-y-4">
        <p className="text-xs text-chrome-text/65 font-mono pb-2">
          Last login: Wed Oct 15 13:22:41 on ttys001
        </p>

        {/* ── Command History ────────────────────────────────────────── */}
        {history.map((item) => (
          <div key={item.id} className="space-y-1.5 animate-fadeIn">
            {/* Prompt line */}
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="text-accent-signal">rashmin@studio</span>
              <span className="text-chrome-text/65">~</span>
              <span className="text-accent-signal">%</span>
              <span className="text-chrome-text">{item.cmd}</span>
            </div>
            {/* Output */}
            {item.output}
          </div>
        ))}

        {/* ── Active Prompt Input ───────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
          <span className="text-accent-signal font-semibold text-sm">rashmin@studio</span>
          <span className="text-chrome-text/65 text-sm">~</span>
          <span className="text-accent-signal text-sm">%</span>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type help to explore..."
              className="w-full bg-transparent border-none outline-none text-sm text-chrome-text font-mono placeholder:text-chrome-text/65 p-0 focus:ring-0"
              autoFocus
            />
          </div>
        </form>

        <div ref={bottomRef} />
      </div>

      {/* ── Terminal Quick Command Chips & Server Content ──────────── */}
      <div className="mt-8 pt-4 border-t border-chrome-text/10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] text-chrome-text/65 uppercase font-mono">Suggested:</span>
          {["whoami", "ls ~/work", "cat about.txt", "projects", "status", "help"].map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => executeCommand(cmd)}
              className="text-xs font-mono px-2.5 py-1 rounded-md bg-chrome-text/5 hover:bg-chrome-text/15 text-accent-sky hover:text-accent-signal transition-colors border border-chrome-text/10"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Server-rendered page details accessible below */}
        {children && <div className="mt-4 pt-4 border-t border-chrome-text/5">{children}</div>}
      </div>
    </div>
  );
}
