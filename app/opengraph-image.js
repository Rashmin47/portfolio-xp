import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const alt = `${siteConfig.name} — ${siteConfig.role}, ${siteConfig.location}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/** Portrait shipped alongside this route (app/rashmindp.jpg), inlined at build. */
async function portraitDataUri() {
  try {
    const file = await readFile(path.join(process.cwd(), "app", "rashmindp.jpg"));
    return `data:image/jpeg;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image() {
  const portrait = await portraitDataUri();
  const skills = (siteConfig.skills || []).slice(0, 4).join("  ·  ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 48,
          backgroundColor: "#0B1220",
          color: "#F4F6FB",
          padding: "40px 56px",
        }}
      >
        {/* Text column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 96,
              height: 6,
              backgroundColor: "#F2C81F",
              marginBottom: 32,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#94A3B8",
              marginTop: 16,
            }}
          >
            {`${siteConfig.role} · ${siteConfig.location}`}
          </div>
          {skills && (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: "#94A3B8",
                marginTop: 40,
              }}
            >
              {skills}
            </div>
          )}
        </div>

        {/* Portrait: 3:4 frame matching the source image, so nothing is cropped */}
        {portrait && (
          <div
            style={{
              display: "flex",
              width: 391,
              height: 550,
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(244,246,251,0.14)",
              flexShrink: 0,
            }}
          >
            <img
              src={portrait}
              alt=""
              width={391}
              height={550}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}
