import { NextResponse,NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = req.nextUrl;
  const width = searchParams.get("width") || "300";
  const height = searchParams.get("height") || "150";
  console.log(`Generating placeholder SVG with dimensions: ${width}x${height}`);
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ddd"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="20" fill="#555">
        ${width}x${height}
      </text>
    </svg>
  `;

    return new NextResponse(svg, {
        headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
        },
    });

}
