import { ImageResponse } from "next/og";

export const alt = "Rashmin Sharma | Software developer, Nepal";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#2F5BEA",
          color: "#F4F6FB",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          Rashmin Sharma
        </div>
        <div
          style={{
            fontSize: 36,
            opacity: 0.9,
          }}
        >
          Software developer, Nepal
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
