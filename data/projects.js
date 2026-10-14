/**
 * @typedef {Object} Project
 * @property {string} slug - Unique identifier for routing
 * @property {string} title - Project title
 * @property {string} description - Brief summary of the project
 * @property {boolean} published - Visibility flag (default: false)
 * @property {string} [year] - Year shipped or created
 * @property {string[]} [tags] - Technologies and tools used
 * @property {string} [href] - External demo or repository link
 * @property {string} [updatedAt] - Last update ISO timestamp
 */

/** @type {Project[]} */
export const projects = [];
