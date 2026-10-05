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
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "User-Agent": "Mozilla/5.0"
    },
    next: { revalidate: 86400 }
  });

  if (!response.ok) {
    return new Response("Team logo unavailable", { status: response.status });
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.toLowerCase().startsWith("image/")) {
    return new Response("Unexpected upstream response", { status: 502 });
  }

  return new Response(await response.arrayBuffer(), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400"
    }
  });
}
