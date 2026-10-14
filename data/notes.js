/**
 * @typedef {Object} Note
 * @property {string} slug - Unique URL slug for the article
 * @property {string} title - Article title
 * @property {string} summary - Brief overview of the technical note
 * @property {string} content - Markdown or text body of the note
 * @property {boolean} published - Visibility flag (default: false)
 * @property {string} [datePublished] - ISO publication date
 * @property {string} [dateModified] - ISO last updated date
 * @property {string[]} [tags] - Topic tags
 */

/** @type {Note[]} */
export const notes = [];
