/**
 * @typedef {Object} RoadmapItem
 * @property {string} id - Unique identifier for the roadmap item
 * @property {string} title - Milestone or initiative name
 * @property {string} description - Reasoning and expected outcome
 * @property {"now" | "next" | "later"} status - Timeline categorization
 * @property {boolean} published - Visibility flag (default: false)
 * @property {string} [quarter] - Target timeframe (e.g. "Q1 2026")
 */

/** @type {RoadmapItem[]} */
export const roadmap = [];
