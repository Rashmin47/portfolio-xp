import SpecTable, { SpecRow } from "@/components/ui/SpecTable";
import LocalTime from "./LocalTime";

export default function CurrentlyTable({
  latestCommit,
  buildingNow,
  location = "Kathmandu, Nepal",
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
        CURRENTLY
      </div>
      <SpecTable>
        <SpecRow label="LOCATION" value={location} />
        <SpecRow label="LOCAL TIME" value={<LocalTime />} />
        {latestCommit && (
          <SpecRow
            label="LATEST COMMIT"
            value={
              <span className="truncate block max-w-[260px] sm:max-w-[320px] text-right font-mono text-xs">
                {latestCommit.url ? (
                  <a
                    href={latestCommit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-ink dark:text-paper"
                    title={latestCommit.message}
                  >
                    <code className="text-signal bg-ink px-1 py-0.5 rounded-xs mr-1 text-[10px] font-semibold">
                      {latestCommit.sha}
                    </code>
                    <span>{latestCommit.message}</span>
                  </a>
                ) : (
                  <>
                    <code className="text-signal bg-ink px-1 py-0.5 rounded-xs mr-1 text-[10px] font-semibold">
                      {latestCommit.sha}
                    </code>
                    <span>{latestCommit.message}</span>
                  </>
                )}
                {latestCommit.relativeDate && (
                  <span className="text-muted ml-1.5 shrink-0">
                    ({latestCommit.relativeDate})
                  </span>
                )}
              </span>
            }
          />
        )}
        {buildingNow && (
          <SpecRow
            label="BUILDING NOW"
            value={
              <span className="truncate block max-w-[260px] sm:max-w-[320px] text-right">
                {buildingNow}
              </span>
            }
          />
        )}
      </SpecTable>
    </div>
  );
}
