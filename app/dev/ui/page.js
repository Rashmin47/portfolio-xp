import { notFound } from "next/navigation";
import {
  Container,
  SectionHeader,
  Label,
  Button,
  TextLink,
  Tag,
  SpecTable,
  SpecRow,
  IndexRow,
  Prose,
  DummyBadge,
  ThemeToggle,
} from "@/components/ui";

export const metadata = {
  title: "Design System Gallery (Dev Only)",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const specSample = [
    { key: "STATUS", value: "ALPHA / EXPERIMENTAL" },
    { key: "RUNTIME", value: "NEXT.JS 15 (APP ROUTER)" },
    { key: "STYLING", value: "TAILWIND V4 + TOKENS" },
    { key: "ACCENT", value: "SIGNAL (#F2C81F)" },
  ];

  const renderComponentSuite = (themeName) => (
    <div className="space-y-12">
      {/* Fluid Typography & Display */}
      <div>
        <SectionHeader number="01" label="TYPOGRAPHY & DISPLAY" />
        <div className="space-y-4">
          <p className="display text-ink dark:text-paper">
            THE WORKSHOP
          </p>
          <h1 className="text-ink dark:text-paper">
            H1 Heading — 56px desktop / 34px mobile
          </h1>
          <h2 className="text-ink dark:text-paper">
            H2 Subheading — 36px desktop / 26px mobile
          </h2>
          <h3 className="text-ink dark:text-paper">
            H3 Subsection — 24px desktop / 20px mobile
          </h3>
          <p className="text-ink dark:text-paper text-base sm:text-lg max-w-[70ch]">
            Body paragraph demonstrating Instrument Sans fluid type at 18px / 17px.
            Line length is kept to a strict 65-75 character maximum for legibility.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div>
        <SectionHeader number="02" label="BUTTONS & LINKS" />
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">
            Primary Action
          </Button>
          <Button variant="primary" arrow>
            Primary with Arrow
          </Button>
          <Button variant="secondary">
            Secondary Action
          </Button>
          <Button variant="secondary" arrow>
            Secondary with Arrow
          </Button>
          <TextLink href="#">
            Animated Underline Link
          </TextLink>
        </div>
      </div>

      {/* Labels, Tags, and Badges */}
      <div>
        <SectionHeader number="03" label="LABELS, TAGS & BADGES" />
        <div className="flex flex-wrap items-center gap-3">
          <Label>System Label</Label>
          <Tag>Next.js 15</Tag>
          <Tag>Tailwind v4</Tag>
          <Tag>WebGL</Tag>
          <DummyBadge />
        </div>
      </div>

      {/* Spec Table */}
      <div>
        <SectionHeader number="04" label="SPEC TABLE (DATASHEET)" />
        <div className="max-w-xl">
          <SpecTable items={specSample} />
          <div className="mt-4">
            <SpecTable>
              <SpecRow label="COORDINATES" value="27.7172° N, 85.3240° E" />
              <SpecRow label="LOCALE" value="Asia/Kathmandu (UTC+05:45)" />
            </SpecTable>
          </div>
        </div>
      </div>

      {/* Index Rows */}
      <div>
        <SectionHeader number="05" label="INDEX ROWS" />
        <div className="max-w-3xl">
          <IndexRow
            index="01"
            title="Portfolio XP & The Workshop"
            meta="2026 · WEB / 3D"
            href="#"
          />
          <IndexRow
            index="02"
            title="Embedded Sensor Gateway"
            meta="2025 · HARDWARE"
            href="#"
          />
          <IndexRow
            index="03"
            title="Offline LLM Inference Node"
            meta="2025 · SYSTEMS"
            href="#"
          />
        </div>
      </div>

      {/* Prose */}
      <div>
        <SectionHeader number="06" label="PROSE CONTAINER (65-75CH)" />
        <Prose>
          <h2>Evidence Over Decoration</h2>
          <p>
            Real projects, real hardware, real data. No fake dashboards, no stock
            imagery, no skill percentages. Every object earns its place on the desk.
          </p>
          <blockquote>
            &ldquo;Specific beats generic. Copy names real things. Phrases like
            &apos;passionate developer&apos; are not used.&rdquo;
          </blockquote>
          <ul>
            <li>Content lives in server-rendered HTML pages</li>
            <li>Accessible HTML panels over persistent 3D world</li>
            <li>One accent: <code>signal #F2C81F</code> paired with ink text</li>
          </ul>
        </Prose>
      </div>
    </div>
  );

  return (
    <div className="py-12 space-y-16">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-ink/10 dark:border-paper/10 pb-6 mb-12">
          <div>
            <Label className="text-signal bg-ink px-2 py-0.5 rounded-xs font-semibold mr-2">
              DEV ONLY
            </Label>
            <h1 className="text-3xl font-bold tracking-tight inline-block align-middle">
              Design System Spec
            </h1>
            <p className="text-sm text-muted mt-1">
              Visual validation suite for all shared tokens and components.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Label>Toggle Page Theme:</Label>
            <ThemeToggle />
          </div>
        </div>
      </Container>

      {/* Section 1: Light Theme Preview */}
      <section className="bg-paper text-ink py-12 border-y border-ink/10">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest px-2.5 py-1 bg-ink text-paper rounded-[14px]">
              THEME: LIGHT (PAPER)
            </span>
            <Label>bg-paper / text-ink</Label>
          </div>
          {renderComponentSuite("light")}
        </Container>
      </section>

      {/* Section 2: Dark Theme Preview */}
      <section className="dark bg-night text-paper py-12 border-b border-paper/10">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest px-2.5 py-1 bg-signal text-ink font-semibold rounded-[14px]">
              THEME: DARK (NIGHT)
            </span>
            <Label className="text-muted">bg-night / text-paper</Label>
          </div>
          {renderComponentSuite("dark")}
        </Container>
      </section>
    </div>
  );
}
