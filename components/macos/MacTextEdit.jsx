"use client";

/**
 * MacTextEdit
 * -----------
 * macOS TextEdit / Document interface matching the WordPad reference adapted to modern macOS:
 *  - Top Document Ruler with tick marks and tab stops
 *  - Clean format toolbar
 *  - Centered document sheet on studio desktop canvas with subtle paper shadow
 */
export default function MacTextEdit({
  documentTitle = "About Me.rtf",
  wordCount,
  children,
}) {
  return (
    <div className="flex-1 flex flex-col bg-[#0F172A]/80 text-paper min-h-0">
      {/* ── TextEdit Ruler Bar ────────────────────────────────────────── */}
      <div className="h-7 px-4 bg-night-surface/90 border-b border-paper/10 flex items-center justify-between select-none shrink-0 overflow-hidden font-mono text-[10px] text-muted">
        {/* Left margin marker */}
        <div className="flex items-center gap-1 text-signal">
          <span>▼</span>
          <span className="text-[9px] text-muted/60">0.0</span>
        </div>

        {/* Ruler ticks & inches */}
        <div className="hidden sm:flex flex-1 items-center justify-evenly px-6 opacity-60">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <span className="h-1.5 w-px bg-paper/20" />
              <span className="text-[9px] font-mono">{num}</span>
              <span className="h-1.5 w-px bg-paper/20" />
            </div>
          ))}
        </div>

        {/* Right margin marker & info */}
        <div className="flex items-center gap-3">
          {wordCount && <span className="text-muted text-[10px] hidden md:inline">{wordCount} words</span>}
          <div className="flex items-center gap-1 text-signal">
            <span className="text-[9px] text-muted/60">8.5</span>
            <span>▼</span>
          </div>
        </div>
      </div>

      {/* ── Document Workspace Canvas ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center">
        {/* Paper Sheet — a container so the document can lay itself out by its own width */}
        <div
          className="@container w-full max-w-3xl bg-paper dark:bg-[#131D33] text-ink dark:text-paper rounded-lg p-6 sm:p-10 shadow-xl border border-paper/10 transition-colors"
          style={{
            minHeight: "100%",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
