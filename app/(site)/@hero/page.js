import HeroWidget from "@/components/home/HeroWidget";

/**
 * @hero slot — the homepage only. Every other route falls through to
 * default.js, so no other page renders a second H1.
 */
export default function HeroSlot() {
  return <HeroWidget />;
}
