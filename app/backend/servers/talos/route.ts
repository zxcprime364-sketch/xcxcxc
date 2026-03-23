import { fetchWithTimeout } from "@/lib/fetch-timeout";
import { NextRequest, NextResponse } from "next/server";
import { validateBackendToken } from "@/lib/validate-token";
import { isValidReferer } from "@/lib/allowed-referers";

export async function GET(req: NextRequest) {
  try {
    const tmdbId = req.nextUrl.searchParams.get("a");
    const mediaType = req.nextUrl.searchParams.get("b");
    const season = req.nextUrl.searchParams.get("c");
    const episode = req.nextUrl.searchParams.get("d");
    const title = req.nextUrl.searchParams.get("f");
    const year = req.nextUrl.searchParams.get("g");
    const ts = Number(req.nextUrl.searchParams.get("gago"));
    const token = req.nextUrl.searchParams.get("putangnamo")!;
    const f_token = req.nextUrl.searchParams.get("f_token")!;

    if (!tmdbId || !mediaType || !title || !year || !ts || !token) {
      return NextResponse.json(
        { success: false, error: "need token" },
        { status: 404 },
      );
    }
    if (Date.now() - Number(ts) > 8000) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 403 },
      );
    }
    if (!validateBackendToken(tmdbId, f_token, ts, token)) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 403 },
      );
    }

   const referer = req.headers.get("referer") || "";
   if (!isValidReferer(referer)) {
     return NextResponse.json(
       { success: false, error: "Forbidden" },
       { status: 403 },
     );
   }

    const XPASS_BASE = "https://play.xpass.top";
    const UPSTREAM_HEADERS = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
      Referer: `${XPASS_BASE}/`,
      Origin: XPASS_BASE,
      Accept: "text/html,*/*",
      "Accept-Language": "en-US,en;q=0.6",
    };

    // ─── STEP 1: Scrape the embed page to get the backups list ───────────────
    // Movie: /e/movie/{tmdbId}
    // TV:    /e/tv/{tmdbId}/{season}/{episode}
    const embedPageUrl =
      mediaType === "tv" && season && episode
        ? `${XPASS_BASE}/e/tv/${tmdbId}/${season}/${episode}`
        : `${XPASS_BASE}/e/movie/${tmdbId}`;

    const pageRes = await fetchWithTimeout(
      embedPageUrl,
      { headers: UPSTREAM_HEADERS },
      6000,
    );
    if (!pageRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "xpass embed page fetch failed",
          status: pageRes.status,
          embedPageUrl,
        },
        { status: pageRes.status },
      );
    }

    const html = await pageRes.text();

    // Extract the backups array from the page JS
    // Use a greedy match up to the final ]; on its own line
    const backupsMatch = html.match(/var\s+backups\s*=\s*\[\s*({[\s\S]*?})/);
    if (!backupsMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not find backups in page",
          htmlPreview: html.slice(0, 500),
        },
        { status: 404 },
      );
    }

    // ─── STEP 2: Parse first backup URL directly ──────────────────────────────
    const firstBackup: { id: string; name: string; url: string; dl: boolean } =
      JSON.parse(backupsMatch[1]);

    const playlistUrl = firstBackup.url.startsWith("http")
      ? firstBackup.url
      : `${XPASS_BASE}${firstBackup.url}`;

    // ─── STEP 3: Fetch playlist.json → get HLS source ────────────────────────
    const playlistRes = await fetchWithTimeout(
      playlistUrl,
      {
        headers: {
          ...UPSTREAM_HEADERS,
          Referer: `${XPASS_BASE}/`,
          Accept: "*/*",
        },
      },
      6000,
    );

    if (!playlistRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "playlist fetch failed",
          status: playlistRes.status,
          playlistUrl,
        },
        { status: playlistRes.status },
      );
    }

    const playlistData = await playlistRes.json();
    const sources: Array<{ file: string; type: string; label: string }> =
      playlistData?.playlist?.[0]?.sources ?? [];

    if (!sources.length) {
      return NextResponse.json(
        { success: false, error: "No sources in playlist", playlistData },
        { status: 404 },
      );
    }

    const bestSource = sources.find((s) => s.type === "hls") ?? sources[0];

    const rawStreamUrl = bestSource.file;

    // ─── STEP 4: Fetch m3u8 + rewrite segments through proxy ─────────────────
    return NextResponse.json({
      success: true,
      links: [{ type: "hls", link: rawStreamUrl }],
      subtitles: [],
    });
  } catch (err) {
    console.error("xpass route error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
