/**
 * @typedef {Object} LabExperiment
 * @property {string} id - Unique identifier for the experiment
 * @property {string} title - Experiment name or hardware setup
 * @property {string} description - What was tested, learned, or measured
 * @property {boolean} published - Visibility flag (default: false)
 * @property {string[]} [tags] - Technologies, hardware, or modules used
 * @property {string} [updatedAt] - Last update ISO timestamp
 */

/** @type {LabExperiment[]} */
export const lab = [];
