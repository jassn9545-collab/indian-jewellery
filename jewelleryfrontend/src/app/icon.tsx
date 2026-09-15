import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export default async function Icon() {
  const logo = await readFile(
    join(process.cwd(), "public/images/indian-jewellery-logo.png"),
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#191919",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ImageResponse renders an embedded source image without a browser. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${logo.toString("base64")}`}
        width={64}
        height={43}
        alt="Indian Jewellery"
      />
    </div>,
    size,
  );
}
