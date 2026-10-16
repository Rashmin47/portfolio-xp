import { siteConfig } from "@/data/site";
import Button from "@/components/ui/Button";
import CurrentlyTable from "@/components/home/CurrentlyTable";
import HeroWidgetShell from "@/components/home/HeroWidgetShell";

/**
 * HeroWidget
 * ----------
 * The homepage's always-visible entry point: the single H1, the tagline and
 * support line from data/site.js, a link into /projects, the control that
 * opens the terminal window, and the live "Currently" rows.
 *
 * It is rendered by the @hero slot, i.e. outside MacWindow, so it is on screen
 * while the terminal window is closed and it never carries window chrome.
 */
export default function HeroWidget() {
  const hero = siteConfig.hero || {};
  const buildingNow = siteConfig.building && siteConfig.building[0];

  return (
    <HeroWidgetShell
      heading={
        <h1 className="font-display text-base sm:text-lg font-semibold tracking-tight text-chrome-text leading-snug">
          {hero.h1 ||
            `${siteConfig.name}, ${String(siteConfig.role || "").toLowerCase()} in ${siteConfig.location}`}
        </h1>
      }
      actions={
        <Button variant="primary" href="/projects" arrow>
          View my projects
        </Button>
      }
    >
      {hero.tagline && (
        <p className="text-xs sm:text-sm font-medium text-chrome-text/90">
          {hero.tagline}
        </p>
      )}

      {hero.support && (
        <p className="text-xs text-muted leading-relaxed">{hero.support}</p>
      )}

      <CurrentlyTable
        location={siteConfig.location}
        buildingNow={buildingNow}
      />
    </HeroWidgetShell>
  );
}
