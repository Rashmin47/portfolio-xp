/**
 * @typedef {Object} RoadmapItem
 * @property {string} id - Unique identifier
 * @property {string} title - Milestone name
 * @property {string} [description] - Summary description
 * @property {string} why - Engineering rationale / why
 * @property {"now" | "next" | "later"} status - Timeline categorization
 * @property {boolean} published - Visibility flag
 * @property {boolean} [dummy] - Flag for dummy testing data
 * @property {string} [quarter] - Target timeframe (e.g. "Q1 2026")
 */

/** @type {RoadmapItem[]} */
export const roadmap = [
  {
    id: "sample-roadmap-now",
    title: "Dummy Milestone: Edge Sensor Integration",
    description: "Synthetic milestone demonstrating live board column formatting.",
    why: "Clearly fake rationale: Establishing local bus communication before expanding to distributed telemetry.",
    status: "now",
    published: true,
    dummy: true,
    quarter: "Q4 2026",
  },
  {
    id: "sample-roadmap-next",
    title: "Dummy Milestone: WebAssembly Inference Engine",
    description: "Synthetic milestone demonstrating queued architecture.",
    why: "Clearly fake rationale: Enables offline browser-side evaluation without recurring cloud compute costs.",
    status: "next",
    published: true,
    dummy: true,
    quarter: "Q1 2027",
  },
  {
    id: "sample-roadmap-later",
    title: "Dummy Milestone: Decentralized State Sync",
    description: "Synthetic milestone demonstrating exploratory roadmap phase.",
    why: "Clearly fake rationale: Investigating CRDT conflict resolution across intermittent radio links.",
    status: "later",
    published: true,
    dummy: true,
    quarter: "Q2 2027",
  },
];
