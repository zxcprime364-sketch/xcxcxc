// hooks/useSubtitleCue.ts
import { useEffect, useState } from "react";

interface Cue {
  start: number;
  end: number;
  text: string;
}

function toSec(t: string) {
  const [h, m, s] = t.trim().replace(",", ".").split(":");
  return +h * 3600 + +m * 60 + +s;
}
function parseSRT({ raw, domain }: { raw: string; domain: string }): Cue[] {
  const cues: Cue[] = [
    {
      start: 1,
      end: 6,
      text: `Dive into an endless streaming experience at <b>${domain}</b>`,
    },
  ];
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized.trim().split(/\n\n+/);

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const lines = block.trim().split("\n");
    const timeIndex = lines.findIndex((l) =>
      /\d{2}:\d{2}:\d{2}[,\.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,\.]\d{3}/.test(l),
    );
    if (timeIndex === -1) continue;

    const [startStr, endStr] = lines[timeIndex].split("-->");
    const start = toSec(startStr);
    const end = toSec(endStr);
    const text = lines
      .slice(timeIndex + 1)
      .join("<br/>")
      .trim();
    if (!text) continue;

    cues.push({ start, end, text });
  }

  return cues;
}
export function useSubtitleCue(
  url: string | null,
  currentTime: number,
  domain: string,
) {
  const [cues, setCues] = useState<Cue[]>([]);

  useEffect(() => {
    if (!url) return setCues([]);
    fetch(url)
      .then((r) => r.text())
      .then((raw) => setCues(parseSRT({ raw, domain })))
      .catch(() => setCues([]));
  }, [url]);
  return (
    cues.find((c) => currentTime >= c.start && currentTime <= c.end)?.text ??
    null
  );
}
