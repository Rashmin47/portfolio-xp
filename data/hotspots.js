/**
 * @typedef {{ x: number, y: number, z: number }} Vec3
 * @typedef {{ position: Vec3, target: Vec3 }} Pose
 * @typedef {{ id: string, label: string, href: string, description: string, pose: Pose }} Hotspot
 */

/** @type {Hotspot[]} */
export const hotspots = [
  {
    id: "laptop",
    label: "Shipped",
    href: "/projects",
    description: "Software projects built and deployed.",
    pose: {
      position: { x: 0, y: 1.4, z: 2.2 },
      target:   { x: 0, y: 0.9, z: 0 },
    },
  },
  {
    id: "pi",
    label: "The Lab",
    href: "/lab",
    description: "Hardware experiments, scripts and prototypes.",
    pose: {
      position: { x: 1.4, y: 1.2, z: 2.0 },
      target:   { x: 0.9, y: 0.75, z: 0 },
    },
  },
  {
    id: "whiteboard",
    label: "Roadmap",
    href: "/roadmap",
    description: "What comes next: goals and planned work.",
    pose: {
      position: { x: -0.2, y: 1.8, z: 2.4 },
      target:   { x: -0.4, y: 1.5, z: -1.8 },
    },
  },
];

/** Default camera pose (back to desk) */
export const defaultPose = {
  position: { x: 0, y: 2.2, z: 4.2 },
  target:   { x: 0, y: 0.7, z: 0 },
};
