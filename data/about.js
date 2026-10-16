/**
 * @typedef {Object} Principle
 * @property {string} title - Principle name
 * @property {string} description - Practical engineering meaning
 */

/**
 * @typedef {Object} AboutData
 * @property {string[]} [intro] - Answer-first opening: who he is, in two sentences
 * @property {string[]} bio - Bio paragraphs
 * @property {string} [education] - Academic or educational background
 * @property {Principle[]} [howIThink] - Engineering and architectural principles
 * @property {string[]} [nowLearning] - Current technical explorations
 * @property {string} [lookingFor] - Collaboration and role preferences
 * @property {string} [community] - Single-line community summary
 * @property {{ src: string, alt: string, width: number, height: number }} [photo] - Optional portrait photo
 */

/** @type {AboutData} */
export const about = {
  // Answer-first opening for /about. Restates the first bio paragraph in the
  // third person so the page leads with who he is; no new claims.
  intro: [
    "Rashmin Sharma is a software developer based in Kathmandu, Nepal.",
    "He builds reliable web applications and backend systems, and experiments with hardware and applied AI.",
  ],
  bio: [
    "I am a software developer based in Kathmandu, Nepal, focused on building reliable web applications, backend systems, and experimenting with hardware and applied AI.",
    "My work is grounded in evidence over decoration: building things that actually run, with clean architecture and published open roadmaps.",
  ],
  education: undefined,
  howIThink: [
    {
      title: "Content lives in HTML",
      description:
        "The 3D scene and dynamic interfaces are doorways, but real content belongs on fast, server-rendered, indexable pages accessible to all.",
    },
    {
      title: "Evidence over decoration",
      description:
        "Real systems, real telemetry, and working software beat vanity metrics, generic claims, and decorative animations.",
    },
    {
      title: "Every object earns its place",
      description:
        "If a component, module, or dependency doesn't serve a clear function or deliberate purpose, it is removed.",
    },
    {
      title: "Specific beats generic",
      description:
        "Speak concretely about architecture, trade-offs, and tools rather than generic industry buzzwords.",
    },
  ],
  nowLearning: [
    "Embedded hardware programming and edge telemetry",
    "Real-time state synchronization algorithms",
    "Local model inference pipelines",
  ],
  lookingFor:
    "Collaborating on high-craft software products, technical discussions on architecture and distributed systems, and building toward founding an enduring product company.",
  community:
    "Active participant in Kathmandu developer meetups and open technical knowledge exchange.",
};
