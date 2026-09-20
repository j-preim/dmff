import { NextResponse } from "next/server";
import { getLeagues } from "@/lib/espn";

export const dynamic = "force-dynamic";

export async function GET() {
  const leagues = await getLeagues();
  return NextResponse.json({
    season: Number(process.env.ESPN_SEASON || 2026),
    generatedAt: new Date().toISOString(),
    leagues
  });
}
