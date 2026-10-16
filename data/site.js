/**
 * @typedef {Object} CTA
 * @property {string} label - Text label for the CTA button/link
 * @property {string} href - Destination URL/path
 */

/**
 * @typedef {Object} HeroConfig
 * @property {string} h1 - Primary SEO heading
 * @property {string} tagline - Creative tagline
 * @property {string} support - Supporting description text
 * @property {CTA[]} ctas - Call to action buttons
 * @property {string} [heroImage] - Optional hero image path
 */

/**
 * @typedef {Object} SiteConfig
 * @property {string} name - Developer's full name
 * @property {string} role - Professional role
 * @property {string} location - Location
 * @property {string} github - GitHub profile URL
 * @property {string} linkedin - LinkedIn profile URL
 * @property {string[]} [profiles] - Extra public profile URLs for schema sameAs
 * @property {string[]} [skills] - Capabilities, emitted as schema knowsAbout
 * @property {HeroConfig} hero - Homepage hero configuration
 * @property {string[]} building - List of active projects/initiatives currently building
 */

/** @type {SiteConfig} */
export const siteConfig = {
  name: "Rashmin Sharma",
  role: "Software developer",
  location: "Kathmandu, Nepal",
  github: "https://github.com/Rashmin47",
  linkedin: "https://www.linkedin.com/in/rashmin-sharma/",
  skills: [
    "Full-Stack Web Development",
    "Next.js & React Development",
    "TypeScript & JavaScript",
    "Node.js & REST API Development",
    "Flutter & Dart App Development",
    "Database Design & MongoDB",
    "AI Integration & LLM-Powered Applications",
    "IoT & Hardware Prototyping",
    "Problem-Solving & Debugging",
    "Technical Collaboration & Project Development",
  ],
  hero: {
    h1: "Rashmin Sharma, software developer in Nepal",
    tagline: "Built on a desk. Aimed at a company.",
    support:
      "I build software, experiment with hardware and AI, and I am working toward founding my own product company.",
    ctas: [
      {
        label: "View my projects",
        href: "/projects",
      },
      {
        label: "Experience",
        href: "/experience",
      },
    ],
  },
  building: [
    "Portfolio XP: 3D interactive portfolio and workspace",
    "Product prototypes and open source experiments",
  ],
};
