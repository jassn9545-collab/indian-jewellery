import { ImageResponse } from "next/og";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#063b2e", color: "#f5f2ea", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "serif", fontSize: 46 }}>T</div>,
    size,
  );
}
