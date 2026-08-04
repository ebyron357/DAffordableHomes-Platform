import { ImageResponse } from "next/og"

export const alt = "D'Affordable Homes — trusted homeownership guidance"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#102b4e",
          color: "#ffffff",
          padding: "72px 84px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, fontWeight: 700 }}>
          <div style={{ width: 64, height: 8, background: "#d6a84b" }} />
          D&apos;Affordable Homes
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div style={{ fontSize: 72, lineHeight: 1.08, fontWeight: 700, letterSpacing: -2 }}>
            Homeownership has steps.
          </div>
          <div style={{ marginTop: 18, fontSize: 42, lineHeight: 1.2, color: "#f2dfb4" }}>
            You don&apos;t have to learn them alone.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#d8e2ee" }}>
          Clear guidance from Debra Allen, REALTOR®
        </div>
      </div>
    ),
    size,
  )
}
