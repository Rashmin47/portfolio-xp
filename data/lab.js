/**
 * @typedef {Object} LabExperiment
 * @property {string} id - Unique identifier
 * @property {string} title - Experiment name or hardware setup
 * @property {string} description - Brief summary of what it does
 * @property {string} [details] - Detailed test notes
 * @property {string[]} [hardware] - Hardware components used
 * @property {string} [status] - Operating status (e.g. "Bench Tested", "Active", "Archived")
 * @property {string} [repo] - Repository link
 * @property {string} [media] - Diagram or media description/path
 * @property {string} [year] - Year
 * @property {boolean} published - Visibility flag
 * @property {boolean} [dummy] - Flag for dummy testing data
 */

/** @type {LabExperiment[]} */
export const lab = [
  {
    id: "sample-lab-1",
    title: "Edge Telemetry & Mock Sensor Rig",
    description: "Dummy experiment: edge sensor sampling loop with mock I2C driver integration.",
    details:
      "Clearly fake experiment details testing multi-line expansion inside an inline details panel: verifying baud-rate synchronization, signal debouncing, and memory leak absence during continuous 24-hour simulation.",
    hardware: ["Raspberry Pi 4", "BME280 Mock Sensor", "Logic Analyzer", "GPIO Breadboard"],
    status: "Bench Tested",
    repo: "https://github.com/Rashmin47/portfolio-xp",
    media: "Synthetic logic capture trace: 0x42 acknowledgment verified.",
    year: "2026",
    published: true,
    dummy: true,
  },
];
