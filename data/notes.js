/**
 * @typedef {Object} NoteBlock
 * @property {"p" | "h2" | "h3" | "ul" | "code" | "quote" | "img"} type - Block type
 * @property {string} [text] - Text content for p, h2, h3, quote, or code
 * @property {string[]} [items] - List items for ul
 * @property {string} [code] - Code string for code blocks
 * @property {string} [src] - Image source URL/data URI
 * @property {string} [alt] - Image alt text
 * @property {string} [caption] - Image caption
 */

/**
 * @typedef {Object} Note
 * @property {string} slug - Unique identifier for routing
 * @property {string} title - Note title
 * @property {string} summary - Brief overview
 * @property {NoteBlock[]} content - Content blocks
 * @property {boolean} published - Visibility flag
 * @property {boolean} [dummy] - Flag for dummy testing data
 * @property {string} [datePublished] - ISO date
 * @property {string} [dateModified] - ISO date
 * @property {string} [readingTime] - Reading duration (e.g. "3 min read")
 * @property {string[]} [tags] - Topic tags
 */

/** @type {Note[]} */
export const notes = [
  {
    slug: "sample-note-a",
    title: "Sample Engineering Note on Synthetic Systems",
    summary:
      "A dummy technical note demonstrating the block renderer across all supported node types.",
    published: true,
    dummy: true,
    datePublished: "2026-10-14",
    readingTime: "3 min read",
    tags: ["Systems", "Architecture", "Testing"],
    content: [
      {
        type: "p",
        text: "This is a dummy paragraph testing body text formatting within the custom block renderer system. It verifies line length, margins, and dark mode contrast.",
      },
      {
        type: "h2",
        text: "Synthetic Architectural Considerations",
      },
      {
        type: "p",
        text: "Demonstrating paragraph spacing and typography hierarchy directly below a level 2 heading.",
      },
      {
        type: "h3",
        text: "Subsystem Partitioning",
      },
      {
        type: "ul",
        items: [
          "First synthetic bullet point covering network boundary isolation.",
          "Second synthetic bullet point verifying list marker alignment.",
          "Third synthetic bullet point ensuring line-height consistency.",
        ],
      },
      {
        type: "quote",
        text: "Evidence over decoration: systems should be measured by observable characteristics rather than hypothetical claims.",
      },
      {
        type: "code",
        code: "// Dummy state machine transition loop\nfunction transition(state, event) {\n  switch (event.type) {\n    case 'TICK':\n      return { ...state, counter: state.counter + 1 };\n    default:\n      return state;\n  }\n}",
      },
      {
        type: "img",
        src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'><rect width='100%25' height='100%25' fill='%23131D33'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23F2C81F' font-family='monospace' font-size='20'>DUMMY BLOCKRENDERER IMAGE TEST</text></svg>",
        alt: "Synthetic diagram test image",
        caption: "Figure 1: Synthetic test diagram rendered via data URI.",
      },
    ],
  },
];
