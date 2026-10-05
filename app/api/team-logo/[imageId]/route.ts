const MYSTIQUE_BASE = "https://mystique-api.fantasy.espn.com/apis/v1/domains/lm/images/";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await params;

  if (!/^[A-Za-z0-9-]+$/.test(imageId)) {
    return new Response("Invalid image id", { status: 400 });
  }

  const response = await fetch(`${MYSTIQUE_BASE}${encodeURIComponent(imageId)}`, {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36"
    },
    next: { revalidate: 86400 }
  });

  const contentType = response.headers.get("content-type") || "";

  if (!response.ok || !contentType.toLowerCase().startsWith("image/")) {
    const upstreamBody = await response.text().catch(() => "");
    console.error("Mystique team logo request failed", {
      imageId,
      status: response.status,
      statusText: response.statusText,
      contentType,
      body: upstreamBody.slice(0, 1000)
    });

    return new Response("Team logo unavailable", {
      status: response.ok ? 502 : response.status,
      headers: {
        "Cache-Control": "no-store"
      }
    });
  }

  return new Response(await response.arrayBuffer(), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400"
    }
  });
}
