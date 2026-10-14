/**
 * @typedef {Object} DecisionLogEntry
 * @property {string} decision - Description of the architectural decision
 * @property {string} rationale - Explanation and trade-offs considered
 */

/**
 * @typedef {Object} Project
 * @property {string} slug - Unique identifier for routing
 * @property {string} title - Project title
 * @property {string} description - Brief summary of the project
 * @property {boolean} published - Visibility flag (default: false)
 * @property {boolean} [dummy] - Flag indicating test/sample data
 * @property {string} [year] - Year shipped or created
 * @property {string[]} [tags] - Technologies and tools used
 * @property {string} [href] - External demo or repository link
 * @property {string} [updatedAt] - Last update ISO timestamp
 * @property {DecisionLogEntry[]} [decisionLog] - Design and architecture decisions
 */

/** @type {Project[]} */
export const projects = [
  {
    title: "Sample Project A",
    slug: "sample-project-a",
    description:
      "Dummy summary for layout testing. This paragraph contains intentionally generic placeholder text to test multi-line text wrapping, responsive card height matching, and typography rendering across desktop and mobile screens without making any assertions about real accomplishments.",
    published: true,
    dummy: true,
    year: "2026",
    tags: ["Dummy Framework", "Dummy Language", "Dummy Database", "Dummy Tooling"],
    href: "https://example.com",
    updatedAt: "2026-10-14T00:00:00Z",
    decisionLog: [
      {
        decision: "Dummy Architectural Decision 1",
        rationale:
          "Dummy rationale for decision 1 demonstrating multi-line text flow and proper spacing between heading, rationale text, and sibling list items.",
      },
      {
        decision: "Dummy Architectural Decision 2",
        rationale:
          "Dummy rationale for decision 2 testing how secondary structural details behave within responsive container widths.",
      },
      {
        decision: "Dummy Architectural Decision 3",
        rationale:
          "Dummy rationale for decision 3 providing an additional entry to ensure the decision-log list scales gracefully without breaking layout rhythm.",
      },
    ],
  },
  {
    title: "Sample Project B",
    slug: "sample-project-b",
    description:
      "Dummy summary for layout testing with minimal fields to verify graceful degradation.",
    published: true,
    dummy: true,
  },
];
