/**
 * @typedef {Object} Venture
 * @property {string} id - Unique identifier
 * @property {string} name - Venture or initiative name
 * @property {string} [title] - Title alias
 * @property {string} problem - Problem being solved
 * @property {string} role - My role in the venture
 * @property {string} stage - Venture stage (e.g. "Research & Prototype", "Pre-seed", "Early Active")
 * @property {string} status - Operating status (e.g. "Active", "Exploratory", "Stealth")
 * @property {string} [url] - Optional link
 * @property {boolean} published - Visibility flag
 * @property {boolean} [dummy] - Flag for dummy testing data
 */

/** @type {Venture[]} */
export const experience = [
  {
    id: "sample-venture-a",
    name: "Sample Venture Alpha",
    title: "Sample Venture Alpha",
    problem:
      "Clearly fake problem statement demonstrating layout wrapping: lack of deterministic synthetic coordination mechanisms across distributed nodes.",
    role: "Founder & Lead Architect (Dummy)",
    stage: "Research & Prototype",
    status: "Exploratory",
    url: "https://example.com",
    published: true,
    dummy: true,
  },
];
