export const DRAFT_STORAGE_KEY = "life4cut-draft-images";
export const RESULT_STORAGE_KEY = "life4cut-images";

type DownloadFormat = "png" | "jpeg";

export type FourCutTheme = {
  id: string;
  name: string;
  frameColor: string;
  paperColor: string;
  accentColor: string;
  bgColor: string;
};

export const FOURCUT_THEMES: FourCutTheme[] = [
  { id: "classic",   name: "클래식",   frameColor: "#10233f", paperColor: "#fffaf6", accentColor: "#677791", bgColor: "#f4f0eb" },
  { id: "film",      name: "필름",     frameColor: "#111111", paperColor: "#1a1a1a", accentColor: "#d4a017", bgColor: "#0d0d0d" },
  { id: "polaroid",  name: "폴라로이드", frameColor: "#e8e0d0", paperColor: "#ffffff", accentColor: "#8a7a6a", bgColor: "#f5f0e8" },
  { id: "floral",    name: "플로럴",   frameColor: "#c0607a", paperColor: "#fff8fa", accentColor: "#e08098", bgColor: "#fce8f0" },
  { id: "neon",      name: "네온",     frameColor: "#00f5d4", paperColor: "#0a0a14", accentColor: "#ff2d6f", bgColor: "#0a0a14" },
  { id: "scrapbook", name: "스크랩북",  frameColor: "#8b6914", paperColor: "#f5f0e0", accentColor: "#c8a060", bgColor: "#d4b896" },
];

export type FourCutOptions = {
  theme?: FourCutTheme;
  filterCss?: string;
};

const CANVAS_WIDTH = 900;
const PAPER_PADDING = 42;
const OUTER_MARGIN = 18;
const COLUMN_GAP = 18;
const HEADER_HEIGHT = 82;
const CENTER_BAND_HEIGHT = 62;
const FOOTER_HEIGHT = 72;
const INNER_WIDTH = CANVAS_WIDTH - PAPER_PADDING * 2;
const SLOT_WIDTH = Math.round((INNER_WIDTH - COLUMN_GAP) / 2);
const SLOT_HEIGHT = Math.round(SLOT_WIDTH * (4 / 3));
const CANVAS_HEIGHT =
  PAPER_PADDING * 2 + HEADER_HEIGHT + CENTER_BAND_HEIGHT + FOOTER_HEIGHT + SLOT_HEIGHT * 2;

export async function renderFourCutToCanvas(
  canvas: HTMLCanvasElement,
  images: string[],
  options?: FourCutOptions
) {
  if (images.length !== 4) {
    throw new Error("4장의 이미지가 모두 필요합니다.");
  }

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("합성용 캔버스를 초기화하지 못했습니다.");
  }

  const theme = options?.theme ?? FOURCUT_THEMES[0];
  const filterCss = options?.filterCss ?? "none";
  const loadedImages = await Promise.all(images.map(loadImage));

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  switch (theme.id) {
    case "film":      drawFilm(ctx, loadedImages, filterCss, theme); break;
    case "polaroid":  drawPolaroid(ctx, loadedImages, filterCss, theme); break;
    case "floral":    drawFloral(ctx, loadedImages, filterCss, theme); break;
    case "neon":      drawNeon(ctx, loadedImages, filterCss, theme); break;
    case "scrapbook": drawScrapbook(ctx, loadedImages, filterCss, theme); break;
    default:          drawClassic(ctx, loadedImages, filterCss, theme); break;
  }
}

// ─── Classic ─────────────────────────────────────────────────────────────────

function drawClassic(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  filterCss: string,
  t: FourCutTheme
) {
  ctx.fillStyle = t.bgColor;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawGrid(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, "rgba(16,35,63,0.05)");

  ctx.fillStyle = t.frameColor;
  ctx.fillRect(OUTER_MARGIN, OUTER_MARGIN, CANVAS_WIDTH - OUTER_MARGIN * 2, CANVAS_HEIGHT - OUTER_MARGIN * 2);

  ctx.fillStyle = t.paperColor;
  ctx.fillRect(PAPER_PADDING, PAPER_PADDING, INNER_WIDTH, CANVAS_HEIGHT - PAPER_PADDING * 2);

  ctx.fillStyle = t.frameColor;
  ctx.font = "700 18px Pretendard, SUIT, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("PIC MOMENT", PAPER_PADDING + 6, PAPER_PADDING + 26);

  ctx.fillStyle = t.accentColor;
  ctx.font = "600 16px Pretendard, SUIT, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("LIFE 4 CUT", CANVAS_WIDTH - PAPER_PADDING - 6, PAPER_PADDING + 26);

  const slots = getSlotPositions();
  images.forEach((img, i) => {
    const s = slots[i];
    if (!s) return;
    ctx.fillStyle = "#d9d9dd";
    ctx.fillRect(s.x, s.y, SLOT_WIDTH, SLOT_HEIGHT);
    drawImageCover(ctx, img, s.x, s.y, SLOT_WIDTH, SLOT_HEIGHT, filterCss);
    ctx.strokeStyle = "rgba(16,35,63,0.06)";
    ctx.lineWidth = 2;
    ctx.strokeRect(s.x, s.y, SLOT_WIDTH, SLOT_HEIGHT);
  });

  drawStandardBand(ctx, t);

  ctx.strokeStyle = "rgba(16,35,63,0.14)";
  ctx.lineWidth = 2;
  ctx.strokeRect(PAPER_PADDING, PAPER_PADDING, INNER_WIDTH, CANVAS_HEIGHT - PAPER_PADDING * 2);

  ctx.fillStyle = t.accentColor;
  ctx.font = "600 14px Pretendard, SUIT, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(getFooterText(), CANVAS_WIDTH / 2, CANVAS_HEIGHT - PAPER_PADDING - 24);
}

// ─── Film ─────────────────────────────────────────────────────────────────────

function drawFilm(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  filterCss: string,
  t: FourCutTheme
) {
  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // sprocket strip left
  drawSprocketStrip(ctx, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = "#111111";
  ctx.fillRect(PAPER_PADDING, PAPER_PADDING, INNER_WIDTH, CANVAS_HEIGHT - PAPER_PADDING * 2);

  // header
  ctx.fillStyle = t.accentColor;
  ctx.font = "700 20px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("✦ PIC MOMENT ✦", CANVAS_WIDTH / 2, PAPER_PADDING + 28);

  ctx.fillStyle = "rgba(212,160,23,0.5)";
  ctx.font = "500 12px 'Courier New', monospace";
  ctx.fillText("35mm · LIFE 4 CUT · KODAK", CANVAS_WIDTH / 2, PAPER_PADDING + 48);

  const slots = getSlotPositions();
  images.forEach((img, i) => {
    const s = slots[i];
    if (!s) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(s.x - 2, s.y - 2, SLOT_WIDTH + 4, SLOT_HEIGHT + 4);
    drawImageCover(ctx, img, s.x, s.y, SLOT_WIDTH, SLOT_HEIGHT);

    // frame counter
    ctx.fillStyle = t.accentColor;
    ctx.font = "700 11px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText(String(i + 1).padStart(2, "0"), s.x + 4, s.y + SLOT_HEIGHT - 6);
  });

  // center band
  const topY = PAPER_PADDING + HEADER_HEIGHT;
  const bandY = topY + SLOT_HEIGHT;
  ctx.fillStyle = "rgba(212,160,23,0.08)";
  ctx.fillRect(PAPER_PADDING, bandY, INNER_WIDTH, CENTER_BAND_HEIGHT);

  ctx.fillStyle = t.accentColor;
  ctx.font = "600 13px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("◈  MEMORY CAPTURED  ◈", CANVAS_WIDTH / 2, bandY + CENTER_BAND_HEIGHT / 2 + 6);

  ctx.fillStyle = "rgba(212,160,23,0.6)";
  ctx.font = "500 12px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText(getFooterText(), CANVAS_WIDTH / 2, CANVAS_HEIGHT - PAPER_PADDING - 20);
}

function drawSprocketStrip(ctx: CanvasRenderingContext2D, _x: number, w: number, h: number) {
  const holeW = 14, holeH = 22, gap = 36, marginX = 6, marginY = 30;
  [marginX, w - marginX - holeW].forEach((sx) => {
    let y = marginY;
    while (y + holeH < h - marginY) {
      ctx.fillStyle = "#2a2a2a";
      roundRectPath(ctx, sx, y, holeW, holeH, 3);
      ctx.fill();
      y += holeH + gap;
    }
  });
}

// ─── Polaroid ────────────────────────────────────────────────────────────────

function drawPolaroid(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  filterCss: string,
  t: FourCutTheme
) {
  ctx.fillStyle = t.bgColor;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // subtle noise texture
  drawNoiseTexture(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, "rgba(120,100,80,0.04)");

  // outer border
  ctx.fillStyle = t.frameColor;
  ctx.fillRect(OUTER_MARGIN, OUTER_MARGIN, CANVAS_WIDTH - OUTER_MARGIN * 2, CANVAS_HEIGHT - OUTER_MARGIN * 2);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(PAPER_PADDING, PAPER_PADDING, INNER_WIDTH, CANVAS_HEIGHT - PAPER_PADDING * 2);

  // header
  ctx.fillStyle = t.accentColor;
  ctx.font = "italic 700 20px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("Pic Moment", CANVAS_WIDTH / 2, PAPER_PADDING + 28);
  ctx.font = "italic 400 13px Georgia, serif";
  ctx.fillStyle = "rgba(138,122,106,0.7)";
  ctx.fillText("life 4 cut — always remember", CANVAS_WIDTH / 2, PAPER_PADDING + 50);

  const slots = getSlotPositions();
  images.forEach((img, i) => {
    const s = slots[i];
    if (!s) return;
    // polaroid card — thick bottom
    const padH = 6, padV = 6, padBottom = 22;
    ctx.fillStyle = "#fafafa";
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 3;
    ctx.fillRect(s.x - padH, s.y - padV, SLOT_WIDTH + padH * 2, SLOT_HEIGHT + padV + padBottom);
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
    drawImageCover(ctx, img, s.x, s.y, SLOT_WIDTH, SLOT_HEIGHT, filterCss);
    drawNoiseTexture(ctx, SLOT_WIDTH, SLOT_HEIGHT, "rgba(255,255,255,0.06)", s.x, s.y);
  });

  drawStandardBand(ctx, t, "italic 700 14px Georgia, serif");

  ctx.fillStyle = t.accentColor;
  ctx.font = "italic 400 13px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(getFooterText(), CANVAS_WIDTH / 2, CANVAS_HEIGHT - PAPER_PADDING - 20);
}

function drawNoiseTexture(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  color: string,
  offsetX = 0, offsetY = 0
) {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < w * h * 0.004; i++) {
    const px = offsetX + Math.random() * w;
    const py = offsetY + Math.random() * h;
    ctx.fillRect(px, py, 1, 1);
  }
  ctx.restore();
}

// ─── Floral ───────────────────────────────────────────────────────────────────

function drawFloral(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  filterCss: string,
  t: FourCutTheme
) {
  ctx.fillStyle = t.bgColor;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // dot pattern background
  ctx.fillStyle = "rgba(192,96,122,0.08)";
  for (let x = 10; x < CANVAS_WIDTH; x += 24) {
    for (let y = 10; y < CANVAS_HEIGHT; y += 24) {
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
    }
  }

  // frame border
  ctx.strokeStyle = t.frameColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(OUTER_MARGIN, OUTER_MARGIN, CANVAS_WIDTH - OUTER_MARGIN * 2, CANVAS_HEIGHT - OUTER_MARGIN * 2);
  ctx.strokeStyle = "rgba(192,96,122,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(OUTER_MARGIN + 5, OUTER_MARGIN + 5, CANVAS_WIDTH - OUTER_MARGIN * 2 - 10, CANVAS_HEIGHT - OUTER_MARGIN * 2 - 10);

  ctx.fillStyle = t.paperColor;
  ctx.fillRect(PAPER_PADDING, PAPER_PADDING, INNER_WIDTH, CANVAS_HEIGHT - PAPER_PADDING * 2);

  // header
  ctx.fillStyle = t.frameColor;
  ctx.font = "700 20px Pretendard, SUIT, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✿ PIC MOMENT ✿", CANVAS_WIDTH / 2, PAPER_PADDING + 28);
  ctx.fillStyle = t.accentColor;
  ctx.font = "400 13px Pretendard, SUIT, sans-serif";
  ctx.fillText("life 4 cut", CANVAS_WIDTH / 2, PAPER_PADDING + 50);

  const slots = getSlotPositions();
  images.forEach((img, i) => {
    const s = slots[i];
    if (!s) return;
    ctx.save();
    roundRectPath(ctx, s.x, s.y, SLOT_WIDTH, SLOT_HEIGHT, 6);
    ctx.clip();
    drawImageCover(ctx, img, s.x, s.y, SLOT_WIDTH, SLOT_HEIGHT, filterCss);
    ctx.restore();
    ctx.strokeStyle = "rgba(192,96,122,0.25)";
    ctx.lineWidth = 1.5;
    roundRectPath(ctx, s.x, s.y, SLOT_WIDTH, SLOT_HEIGHT, 6);
    ctx.stroke();
  });

  // flower clusters at corners
  const corners: [number, number][] = [
    [OUTER_MARGIN + 4, OUTER_MARGIN + 4],
    [CANVAS_WIDTH - OUTER_MARGIN - 4, OUTER_MARGIN + 4],
    [OUTER_MARGIN + 4, CANVAS_HEIGHT - OUTER_MARGIN - 4],
    [CANVAS_WIDTH - OUTER_MARGIN - 4, CANVAS_HEIGHT - OUTER_MARGIN - 4],
  ];
  corners.forEach(([cx, cy]) => drawFlowerCluster(ctx, cx, cy));

  drawStandardBand(ctx, t);

  ctx.fillStyle = t.accentColor;
  ctx.font = "400 13px Pretendard, SUIT, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(getFooterText(), CANVAS_WIDTH / 2, CANVAS_HEIGHT - PAPER_PADDING - 20);
}

function drawFlowerCluster(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const petals = 5, r = 10, pr = 5;
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, pr, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? "rgba(224,128,152,0.7)" : "rgba(248,180,200,0.7)";
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, pr * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,220,100,0.9)";
  ctx.fill();
  ctx.restore();
}

// ─── Neon ─────────────────────────────────────────────────────────────────────

function drawNeon(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  filterCss: string,
  t: FourCutTheme
) {
  ctx.fillStyle = "#0a0a14";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // subtle scanlines
  ctx.fillStyle = "rgba(0,245,212,0.015)";
  for (let y = 0; y < CANVAS_HEIGHT; y += 4) {
    ctx.fillRect(0, y, CANVAS_WIDTH, 2);
  }

  // neon outer glow frame
  ctx.save();
  ctx.shadowColor = "#00f5d4";
  ctx.shadowBlur = 18;
  ctx.strokeStyle = "#00f5d4";
  ctx.lineWidth = 2;
  ctx.strokeRect(OUTER_MARGIN, OUTER_MARGIN, CANVAS_WIDTH - OUTER_MARGIN * 2, CANVAS_HEIGHT - OUTER_MARGIN * 2);
  ctx.restore();

  // inner frame
  ctx.strokeStyle = "rgba(0,245,212,0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(PAPER_PADDING - 4, PAPER_PADDING - 4, INNER_WIDTH + 8, CANVAS_HEIGHT - PAPER_PADDING * 2 + 8);

  // header
  ctx.save();
  ctx.shadowColor = "#00f5d4";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#00f5d4";
  ctx.font = "700 22px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("PIC MOMENT", CANVAS_WIDTH / 2, PAPER_PADDING + 30);
  ctx.restore();

  ctx.fillStyle = "rgba(255,45,111,0.7)";
  ctx.font = "500 12px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("LIFE 4 CUT  ·  NEON EDITION", CANVAS_WIDTH / 2, PAPER_PADDING + 50);

  const slots = getSlotPositions();
  images.forEach((img, i) => {
    const s = slots[i];
    if (!s) return;
    drawImageCover(ctx, img, s.x, s.y, SLOT_WIDTH, SLOT_HEIGHT, filterCss);

    // neon corner brackets
    const bLen = 20, bW = 2;
    ctx.save();
    ctx.strokeStyle = "#ff2d6f";
    ctx.shadowColor = "#ff2d6f";
    ctx.shadowBlur = 8;
    ctx.lineWidth = bW;
    // top-left
    ctx.beginPath(); ctx.moveTo(s.x, s.y + bLen); ctx.lineTo(s.x, s.y); ctx.lineTo(s.x + bLen, s.y); ctx.stroke();
    // top-right
    ctx.beginPath(); ctx.moveTo(s.x + SLOT_WIDTH - bLen, s.y); ctx.lineTo(s.x + SLOT_WIDTH, s.y); ctx.lineTo(s.x + SLOT_WIDTH, s.y + bLen); ctx.stroke();
    // bottom-left
    ctx.beginPath(); ctx.moveTo(s.x, s.y + SLOT_HEIGHT - bLen); ctx.lineTo(s.x, s.y + SLOT_HEIGHT); ctx.lineTo(s.x + bLen, s.y + SLOT_HEIGHT); ctx.stroke();
    // bottom-right
    ctx.beginPath(); ctx.moveTo(s.x + SLOT_WIDTH - bLen, s.y + SLOT_HEIGHT); ctx.lineTo(s.x + SLOT_WIDTH, s.y + SLOT_HEIGHT); ctx.lineTo(s.x + SLOT_WIDTH, s.y + SLOT_HEIGHT - bLen); ctx.stroke();
    ctx.restore();
  });

  const topY = PAPER_PADDING + HEADER_HEIGHT;
  const bandY = topY + SLOT_HEIGHT;
  ctx.fillStyle = "rgba(0,245,212,0.04)";
  ctx.fillRect(PAPER_PADDING, bandY, INNER_WIDTH, CENTER_BAND_HEIGHT);

  ctx.save();
  ctx.shadowColor = "#ff2d6f";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#ff2d6f";
  ctx.font = "600 13px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("★  MEMORY FRAME  ★", CANVAS_WIDTH / 2, bandY + CENTER_BAND_HEIGHT / 2 + 6);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "#00f5d4";
  ctx.shadowBlur = 6;
  ctx.fillStyle = "rgba(0,245,212,0.7)";
  ctx.font = "500 12px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText(getFooterText(), CANVAS_WIDTH / 2, CANVAS_HEIGHT - PAPER_PADDING - 20);
  ctx.restore();
}

// ─── Scrapbook ────────────────────────────────────────────────────────────────

function drawScrapbook(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  filterCss: string,
  t: FourCutTheme
) {
  // kraft paper background
  ctx.fillStyle = "#d4b896";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawNoiseTexture(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, "rgba(80,40,10,0.06)");

  // washi tape strips at top and bottom
  drawWashiTape(ctx, 0, 30, CANVAS_WIDTH, 28, "rgba(255,200,80,0.35)", 0);
  drawWashiTape(ctx, 0, CANVAS_HEIGHT - 58, CANVAS_WIDTH, 28, "rgba(150,200,180,0.35)", 0);

  // cream card
  ctx.fillStyle = t.paperColor;
  ctx.shadowColor = "rgba(80,40,10,0.18)";
  ctx.shadowBlur = 12; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 4;
  ctx.fillRect(PAPER_PADDING, PAPER_PADDING, INNER_WIDTH, CANVAS_HEIGHT - PAPER_PADDING * 2);
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

  // dashed border
  ctx.save();
  ctx.strokeStyle = "rgba(139,105,20,0.35)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(PAPER_PADDING + 6, PAPER_PADDING + 6, INNER_WIDTH - 12, CANVAS_HEIGHT - PAPER_PADDING * 2 - 12);
  ctx.restore();

  // header
  ctx.fillStyle = t.frameColor;
  ctx.font = "700 20px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("✂ PIC MOMENT ✂", CANVAS_WIDTH / 2, PAPER_PADDING + 28);
  ctx.fillStyle = t.accentColor;
  ctx.font = "italic 400 13px Georgia, serif";
  ctx.fillText("life 4 cut — scrapbook edition", CANVAS_WIDTH / 2, PAPER_PADDING + 50);

  const slots = getSlotPositions();
  images.forEach((img, i) => {
    const s = slots[i];
    if (!s) return;
    // slightly rotated card feel
    const angle = [-0.012, 0.009, 0.008, -0.01][i] ?? 0;
    ctx.save();
    ctx.translate(s.x + SLOT_WIDTH / 2, s.y + SLOT_HEIGHT / 2);
    ctx.rotate(angle);
    ctx.shadowColor = "rgba(80,40,10,0.2)";
    ctx.shadowBlur = 8; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 3;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-SLOT_WIDTH / 2 - 4, -SLOT_HEIGHT / 2 - 4, SLOT_WIDTH + 8, SLOT_HEIGHT + 8);
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
    drawImageCover(ctx, img, -SLOT_WIDTH / 2, -SLOT_HEIGHT / 2, SLOT_WIDTH, SLOT_HEIGHT, filterCss);
    ctx.restore();

    // corner diamond tape marks
    drawCornerTape(ctx, s.x, s.y);
    drawCornerTape(ctx, s.x + SLOT_WIDTH, s.y, true);
    drawCornerTape(ctx, s.x, s.y + SLOT_HEIGHT, false, true);
    drawCornerTape(ctx, s.x + SLOT_WIDTH, s.y + SLOT_HEIGHT, true, true);
  });

  drawStandardBand(ctx, t, "italic 700 14px Georgia, serif");

  ctx.fillStyle = t.accentColor;
  ctx.font = "italic 400 12px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(getFooterText(), CANVAS_WIDTH / 2, CANVAS_HEIGHT - PAPER_PADDING - 20);
}

function drawCornerTape(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  flipX = false, flipY = false
) {
  ctx.save();
  ctx.translate(x, y);
  if (flipX) ctx.scale(-1, 1);
  if (flipY) ctx.scale(1, -1);
  ctx.fillStyle = "rgba(255,220,80,0.55)";
  ctx.beginPath();
  ctx.moveTo(-12, 0); ctx.lineTo(0, -12); ctx.lineTo(12, 0); ctx.lineTo(0, 12);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawWashiTape(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  color: string, angle: number
) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  // stripe pattern
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  for (let i = -w; i < w; i += 16) {
    ctx.beginPath();
    ctx.moveTo(i, -h / 2);
    ctx.lineTo(i + h, h / 2);
    ctx.stroke();
  }
  ctx.restore();
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function getSlotPositions() {
  const leftX = PAPER_PADDING;
  const rightX = PAPER_PADDING + SLOT_WIDTH + COLUMN_GAP;
  const topY = PAPER_PADDING + HEADER_HEIGHT;
  const bottomY = topY + SLOT_HEIGHT + CENTER_BAND_HEIGHT;
  return [
    { x: leftX,  y: topY },
    { x: rightX, y: topY },
    { x: leftX,  y: bottomY },
    { x: rightX, y: bottomY },
  ];
}

function drawStandardBand(
  ctx: CanvasRenderingContext2D,
  t: FourCutTheme,
  font?: string
) {
  const topY = PAPER_PADDING + HEADER_HEIGHT;
  const bandY = topY + SLOT_HEIGHT;
  const bandMid = bandY + Math.round(CENTER_BAND_HEIGHT / 2);

  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAPER_PADDING, bandY); ctx.lineTo(CANVAS_WIDTH - PAPER_PADDING, bandY);
  ctx.moveTo(PAPER_PADDING, bandY + CENTER_BAND_HEIGHT); ctx.lineTo(CANVAS_WIDTH - PAPER_PADDING, bandY + CENTER_BAND_HEIGHT);
  ctx.stroke();

  ctx.fillStyle = t.accentColor;
  ctx.font = font ?? "700 12px Pretendard, SUIT, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("MEMORY FRAME", CANVAS_WIDTH / 2 - 155, bandMid + 8);
  ctx.fillText("KEEP YOURSELF ALIVE", CANVAS_WIDTH / 2 + 110, bandMid + 8);
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number, height: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y <= height; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }
  ctx.restore();
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number, y: number, width: number, height: number,
  filterCss?: string
) {
  const ir = image.width / image.height;
  const fr = width / height;
  let sw = image.width, sh = image.height, sx = 0, sy = 0;

  if (ir > fr) {
    sw = image.height * fr;
    sx = (image.width - sw) / 2;
  } else {
    sh = image.width / fr;
    sy = (image.height - sh) / 2;
  }

  ctx.save();
  if (filterCss && filterCss !== "none") ctx.filter = filterCss;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
  ctx.restore();
}

function getFooterText() {
  const fmt = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
  return `${fmt.format(new Date())} | MADE WITH PIC MOMENT`;
}

// ─── Public utilities ─────────────────────────────────────────────────────────

export async function downloadCanvasImage(
  canvas: HTMLCanvasElement,
  format: DownloadFormat,
  fileName: string
) {
  const mimeType = format === "png" ? "image/png" : "image/jpeg";
  const quality = format === "png" ? 1 : 0.95;
  const blob = await canvasToBlob(canvas, mimeType, quality);
  const objectUrl = URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}

export function buildLife4CutFilename(format: DownloadFormat) {
  const now = new Date();
  const pad = (v: number) => String(v).padStart(2, "0");
  const stamp = [now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate())].join("");
  const time = [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join("");
  return `life4cut-${stamp}-${time}.${format === "png" ? "png" : "jpg"}`;
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error("이미지 파일 생성에 실패했습니다.")); return; }
      resolve(blob);
    }, type, quality);
  });
}

async function loadImage(source: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("촬영 이미지를 불러오지 못했습니다."));
    image.src = source;
  });
}
