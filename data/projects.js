/**
 * @typedef {Object} ProjectLink
 * @property {string} label - Display label for the link
 * @property {string} url - Destination URL
 */

/**
 * @typedef {Object} ProjectDecision
 * @property {string} title - Architectural decision title
 * @property {string} chose - Option chosen
 * @property {string} rejected - Alternative rejected
 * @property {string} why - Engineering rationale and trade-offs
 */

/**
 * @typedef {Object} ProjectArchitecture
 * @property {string} [text] - Architectural description
 * @property {string} [image] - Architectural diagram image path
 */

/**
 * @typedef {Object} ProjectImage
 * @property {string} src - Image path or data URI
 * @property {string} alt - Required descriptive alternative text
 * @property {number} width - Width in pixels
 * @property {number} height - Height in pixels
 * @property {string} [caption] - Optional caption
 */

/**
 * @typedef {Object} Project
 * @property {string} slug - Unique identifier for routing (required)
 * @property {string} [name] - Project name (required: name or title)
 * @property {string} [title] - Project title (required: name or title)
 * @property {string} [summary] - One-line project summary (required: summary or description)
 * @property {string} [description] - Extended description (required: summary or description)
 * @property {boolean} published - Visibility flag (default: false)
 * @property {boolean} [dummy] - Flag indicating test/sample data
 * @property {string} [year] - Year shipped or created
 * @property {string} [status] - Status (e.g. "Shipped", "Prototype", "Active")
 * @property {string} [role] - Engineering role
 * @property {string} [problem] - Problem statement
 * @property {string[]} [tags] - Technologies and tools used
 * @property {string[]} [constraints] - Project constraints
 * @property {ProjectLink[]} [links] - External links [{label, url}]
 * @property {ProjectDecision[]} [decisions] - Architectural decisions [{title, chose, rejected, why}]
 * @property {string[]} [breakages] - What broke / post-mortems [string]
 * @property {string} [outcome] - Technical and business outcome
 * @property {ProjectArchitecture} [architecture] - Architecture {text, image}
 * @property {ProjectImage[]} [images] - Screenshots [{src, alt, width, height, caption}]
 * @property {string} [updated] - Last updated ISO date (canonical; drives "Last updated" and sitemap lastModified)
 * @property {string} [updatedAt] - Last update ISO timestamp
 */

/** @type {Project[]} */
export const projects = [
  {
    name: "Sample Project A",
    title: "Sample Project A",
    slug: "sample-project-a",
    summary:
      "Dummy summary for layout testing with all fields populated to test the engineering record layout.",
    description:
      "Dummy summary for layout testing. This paragraph contains intentionally generic placeholder text to test multi-line text wrapping, responsive card height matching, and typography rendering across desktop and mobile screens without making any assertions about real accomplishments.",
    published: true,
    dummy: true,
    year: "2026",
    status: "Prototype",
    role: "Systems Engineer (Dummy)",
    problem:
      "Clearly fake problem description for layout verification. Demonstrates multi-line text wrapping across responsive containers without asserting real production problems.",
    tags: ["Dummy Framework", "Dummy Language", "Dummy Database", "Dummy Tooling"],
    constraints: [
      "Simulated sub-50ms latency budget across client network connections.",
      "Zero external telemetry in isolated testing environments.",
      "Deterministic state rehydration within memory limits.",
    ],
    links: [
      { label: "Live Demo", url: "https://example.com" },
      { label: "Source Code", url: "https://example.com" },
    ],
    decisions: [
      {
        title: "State Synchronization Protocol",
        chose: "Compact binary framing over WebSocket",
        rejected: "JSON long-polling endpoints",
        why: "Reduced frame overhead by 68% in synthetic testing environments.",
      },
      {
        title: "Persistence Strategy",
        chose: "Local write-ahead log with disk snapshotting",
        rejected: "Distributed ACID store",
        why: "Avoided network round-trips and maintained sub-millisecond local commit times.",
      },
    ],
    architecture: {
      text: "Simulated architectural overview. Incoming client events are queued in a local memory ring buffer, batch-processed every tick, and persisted to an append-only transaction ledger.",
    },
    breakages: [
      "Buffer starvation during synthetic burst traffic simulation due to unthrottled worker tasks.",
      "Clock skew anomaly when running synthetic nodes across uncoordinated simulation instances.",
    ],
    outcome:
      "Synthetic layout test outcome: Successfully rendered multi-column engineering record layout with zero real claims.",
    images: [
      {
        src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='675' viewBox='0 0 1200 675'><rect width='100%25' height='100%25' fill='%23131D33'/><rect x='40' y='40' width='1120' height='595' rx='14' fill='none' stroke='%232F5BEA' stroke-width='2'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23F2C81F' font-family='monospace' font-size='28' font-weight='bold'>SAMPLE PROJECT A · SYNTHETIC PREVIEW</text></svg>",
        alt: "Sample Project A synthetic dashboard preview",
        width: 1200,
        height: 675,
        caption: "Synthetic interface layout test preview.",
      },
    ],
    updatedAt: "2026-10-14T00:00:00Z",
  },
  {
    name: "Sample Project B",
    title: "Sample Project B",
    slug: "sample-project-b",
    summary:
      "Dummy summary for layout testing with minimal fields to verify graceful degradation.",
    description:
      "Dummy summary for layout testing with minimal fields to verify graceful degradation.",
    published: true,
    dummy: true,
  },
];
