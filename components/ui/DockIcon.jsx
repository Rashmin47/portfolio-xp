/**
 * DockIcon
 * --------
 * Inline single-stroke UI icons for the dock and menu bar. One consistent
 * 1.5px stroke, currentColor, no external icon dependency.
 */

const PATHS = {
  // Terminal prompt in a window
  terminal: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M7 10l3 2.5-3 2.5" />
      <path d="M12.5 15H16" />
    </>
  ),
  // Folder
  folder: (
    <>
      <path d="M3.5 7.5a2 2 0 0 1 2-2h3.2l1.6 2h8.2a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
    </>
  ),
  // Lab flask
  flask: (
    <>
      <path d="M9 4h6" />
      <path d="M10.5 4v5.2l-4.4 8a1.6 1.6 0 0 0 1.4 2.3h9a1.6 1.6 0 0 0 1.4-2.3l-4.4-8V4" />
      <path d="M8.3 14.5h7.4" />
    </>
  ),
  // Briefcase
  briefcase: (
    <>
      <rect x="3.5" y="8" width="17" height="11" rx="2" />
      <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" />
      <path d="M3.5 12.5h17" />
    </>
  ),
  // Board with pinned columns
  board: (
    <>
      <rect x="3.5" y="4.5" width="17" height="11.5" rx="2" />
      <path d="M7 8.5h4M7 11.5h7" />
      <path d="M12 16v3.5" />
      <path d="M9 19.5h6" />
    </>
  ),
  // Note pad
  notes: (
    <>
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
      <path d="M8 8.5h8M8 12h8M8 15.5h5" />
    </>
  ),
  // Person
  person: (
    <>
      <circle cx="12" cy="9" r="3.2" />
      <path d="M5.8 19.5a6.4 6.4 0 0 1 12.4 0" />
    </>
  ),
  // Envelope
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.8 7.4l7.3 5a1.6 1.6 0 0 0 1.8 0l7.3-5" />
    </>
  ),
  // Assistant chat bubble
  assistant: (
    <>
      <path d="M4 12.2a7 7 0 0 1 7-7h2a7 7 0 0 1 0 14h-3.2L5 21.5v-3.9A7 7 0 0 1 4 12.2z" />
      <path d="M9.5 12h.01M14.5 12h.01" />
    </>
  ),
};

export default function DockIcon({ name, className = "h-5 w-5" }) {
  const glyph = PATHS[name];
  if (!glyph) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}
