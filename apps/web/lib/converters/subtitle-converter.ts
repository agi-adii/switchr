/**
 * Subtitle format converter — SRT ↔ VTT ↔ ASS
 * All conversions run entirely client-side.
 */

export interface SubtitleCue {
  index: number;
  startTime: string; // "HH:MM:SS,mmm" (SRT) or "HH:MM:SS.mmm" (VTT)
  endTime: string;
  text: string;
}

// ─── Parsers ──────────────────────────────────────────────────

export function parseSrt(srtStr: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  const blocks = srtStr.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split(/\r?\n/);
    if (lines.length < 3) continue;

    const index = parseInt(lines[0], 10);
    const timeMatch = lines[1].match(
      /(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/
    );
    if (!timeMatch) continue;

    cues.push({
      index,
      startTime: timeMatch[1],
      endTime: timeMatch[2],
      text: lines.slice(2).join("\n"),
    });
  }

  return cues;
}

export function parseVtt(vttStr: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  // Remove WEBVTT header and any metadata
  const content = vttStr.replace(/^WEBVTT[^\n]*\n(?:.*\n)*?\n/, "").trim();
  const blocks = content.split(/\n\s*\n/);

  let idx = 1;
  for (const block of blocks) {
    const lines = block.trim().split(/\r?\n/);
    if (lines.length < 2) continue;

    // Find the timestamp line
    let timeLineIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("-->")) {
        timeLineIdx = i;
        break;
      }
    }

    const timeMatch = lines[timeLineIdx].match(
      /(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/
    );
    if (!timeMatch) continue;

    cues.push({
      index: idx++,
      startTime: timeMatch[1].replace(".", ","),
      endTime: timeMatch[2].replace(".", ","),
      text: lines
        .slice(timeLineIdx + 1)
        .join("\n")
        .replace(/<[^>]+>/g, ""), // Strip HTML tags
    });
  }

  return cues;
}

export function parseAss(assStr: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  const lines = assStr.split(/\r?\n/);

  let inEvents = false;
  let formatFields: string[] = [];
  let idx = 1;

  for (const line of lines) {
    if (line.trim().toLowerCase() === "[events]") {
      inEvents = true;
      continue;
    }

    if (inEvents && line.startsWith("Format:")) {
      formatFields = line
        .substring(7)
        .split(",")
        .map((f) => f.trim().toLowerCase());
      continue;
    }

    if (inEvents && line.startsWith("Dialogue:")) {
      const values = line.substring(9).split(",");
      const startIdx = formatFields.indexOf("start");
      const endIdx = formatFields.indexOf("end");
      const textIdx = formatFields.indexOf("text");

      if (startIdx === -1 || endIdx === -1 || textIdx === -1) continue;

      const start = convertAssTime(values[startIdx]?.trim() || "");
      const end = convertAssTime(values[endIdx]?.trim() || "");
      // Text field may contain commas, so join everything from textIdx onward
      const text = values
        .slice(textIdx)
        .join(",")
        .trim()
        .replace(/\\N/g, "\n")
        .replace(/\{[^}]*\}/g, ""); // Strip ASS style overrides

      cues.push({
        index: idx++,
        startTime: start,
        endTime: end,
        text,
      });
    }

    if (inEvents && line.startsWith("[") && !line.startsWith("[Events]")) {
      inEvents = false;
    }
  }

  return cues;
}

// ─── Generators ───────────────────────────────────────────────

export function cuesToSrt(cues: SubtitleCue[]): string {
  return cues
    .map(
      (cue, i) =>
        `${i + 1}\n${cue.startTime} --> ${cue.endTime}\n${cue.text}`
    )
    .join("\n\n");
}

export function cuesToVtt(cues: SubtitleCue[]): string {
  const header = "WEBVTT\n\n";
  return (
    header +
    cues
      .map(
        (cue) =>
          `${cue.startTime.replace(",", ".")} --> ${cue.endTime.replace(",", ".")}\n${cue.text}`
      )
      .join("\n\n")
  );
}

export function cuesToAss(cues: SubtitleCue[]): string {
  const header = `[Script Info]
Title: Converted by Switchr
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const dialogues = cues
    .map((cue) => {
      const start = toAssTime(cue.startTime);
      const end = toAssTime(cue.endTime);
      const text = cue.text.replace(/\n/g, "\\N");
      return `Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`;
    })
    .join("\n");

  return header + dialogues + "\n";
}

// ─── High-Level Conversions ───────────────────────────────────

export function convertSubtitles(
  input: string,
  fromFormat: "srt" | "vtt" | "ass",
  toFormat: "srt" | "vtt" | "ass"
): string {
  let cues: SubtitleCue[];

  switch (fromFormat) {
    case "srt":
      cues = parseSrt(input);
      break;
    case "vtt":
      cues = parseVtt(input);
      break;
    case "ass":
      cues = parseAss(input);
      break;
    default:
      throw new Error(`Unsupported source subtitle format: ${fromFormat}`);
  }

  if (cues.length === 0) {
    throw new Error("No subtitle cues found in the input file. Please check the format.");
  }

  switch (toFormat) {
    case "srt":
      return cuesToSrt(cues);
    case "vtt":
      return cuesToVtt(cues);
    case "ass":
      return cuesToAss(cues);
    default:
      throw new Error(`Unsupported target subtitle format: ${toFormat}`);
  }
}

// ─── Time Helpers ─────────────────────────────────────────────

/** Convert ASS time format (H:MM:SS.CC) to SRT format (HH:MM:SS,mmm) */
function convertAssTime(assTime: string): string {
  const match = assTime.match(/(\d+):(\d{2}):(\d{2})\.(\d{2})/);
  if (!match) return "00:00:00,000";
  const h = match[1].padStart(2, "0");
  const m = match[2];
  const s = match[3];
  const ms = match[4] + "0"; // centiseconds → milliseconds
  return `${h}:${m}:${s},${ms}`;
}

/** Convert SRT time format (HH:MM:SS,mmm) to ASS time format (H:MM:SS.CC) */
function toAssTime(srtTime: string): string {
  const match = srtTime.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
  if (!match) return "0:00:00.00";
  const h = parseInt(match[1], 10).toString();
  const m = match[2];
  const s = match[3];
  const cs = match[4].substring(0, 2); // milliseconds → centiseconds
  return `${h}:${m}:${s}.${cs}`;
}
