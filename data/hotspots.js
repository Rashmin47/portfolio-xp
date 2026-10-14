/**
 * @typedef {{ x: number, y: number, z: number }} Vec3
 * @typedef {{ position: Vec3, target: Vec3 }} Pose
 * @typedef {{ id: string, label: string, href: string, description: string, pose: Pose, objectId?: string }} Hotspot
 */

/** @type {Hotspot[]} */
export const hotspots = [
  {
    id: "laptop",
    label: "Shipped",
    href: "/projects",
    description: "Software projects built and deployed.",
    objectId: "laptop",
    pose: {
      position: { x: -0.1, y: 1.25, z: 1.7 },
      target:   { x: -0.1, y: 0.88, z: 0.08 },
    },
  },
  {
    id: "pi",
    label: "The Lab",
    href: "/lab",
    description: "Hardware experiments, scripts and prototypes.",
    objectId: "pi",
    pose: {
      position: { x: 1.25, y: 1.3, z: 1.6 },
      target:   { x: 1.25, y: 0.82, z: 0.05 },
    },
  },
  {
    id: "whiteboard",
    label: "Roadmap",
    href: "/roadmap",
    description: "What comes next: goals and planned work.",
    objectId: "whiteboard",
    pose: {
      position: { x: -0.3, y: 2.1, z: -0.4 },
      target:   { x: -0.3, y: 2.05, z: -2.46 },
    },
  },
  {
    id: "notebook",
    label: "Notes",
    href: "/notes",
    description: "Thoughts, write-ups and dev logs.",
    objectId: "notebook",
    pose: {
      position: { x: -1.0, y: 1.3, z: 1.7 },
      target:   { x: -1.0, y: 0.8, z: 0.28 },
    },
  },
  {
    id: "plant",
    label: "About",
    href: "/about",
    description: "Who I am, what I care about.",
    objectId: "plant",
    pose: {
      position: { x: -1.78, y: 1.3, z: 1.6 },
      target:   { x: -1.78, y: 0.95, z: -0.08 },
    },
  },
  {
    id: "phone",
    label: "Contact",
    href: "/contact",
    description: "Say hello or collaborate.",
    objectId: "phone",
    pose: {
      position: { x: 1.82, y: 1.3, z: 1.6 },
      target:   { x: 1.82, y: 0.9, z: 0.2 },
    },
  },
  {
    id: "book",
    label: "Ventures",
    href: "/ventures",
    description: "Companies, startups and bets I am making.",
    objectId: "book",
    pose: {
      position: { x: 0.68, y: 1.3, z: 1.7 },
      target:   { x: 0.68, y: 0.85, z: 0.28 },
    },
  },
];

/** Default camera pose (isometric 3/4 workshop eye-level overview) */
export const defaultPose = {
  position: { x: 0, y: 2.15, z: 3.9 },
  target:   { x: 0, y: 0.95, z: 0 },
};
