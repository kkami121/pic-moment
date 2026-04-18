export const DRAFT_STORAGE_KEY = "life4cut-draft-images";
export const RESULT_STORAGE_KEY = "life4cut-images";

type DownloadFormat = "png" | "jpeg";

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

export async function renderFourCutToCanvas(canvas: HTMLCanvasElement, images: string[]) {
  if (images.length !== 4) {
    throw new Error("4장의 이미지가 모두 필요합니다.");
  }

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("합성용 캔버스를 초기화하지 못했습니다.");
  }

  const loadedImages = await Promise.all(images.map((image) => loadImage(image)));

  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#f4f0eb";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawGridBackground(context, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.fillStyle = "#10233f";
  context.fillRect(OUTER_MARGIN, OUTER_MARGIN, CANVAS_WIDTH - OUTER_MARGIN * 2, CANVAS_HEIGHT - OUTER_MARGIN * 2);

  context.fillStyle = "#fffaf6";
  context.fillRect(PAPER_PADDING, PAPER_PADDING, INNER_WIDTH, CANVAS_HEIGHT - PAPER_PADDING * 2);

  context.fillStyle = "#10233f";
  context.font = "700 18px Pretendard, SUIT, sans-serif";
  context.textAlign = "left";
  context.fillText("PIC MOMENT", PAPER_PADDING + 6, PAPER_PADDING + 26);

  context.fillStyle = "#677791";
  context.font = "600 16px Pretendard, SUIT, sans-serif";
  context.textAlign = "right";
  context.fillText("LIFE 4 CUT", CANVAS_WIDTH - PAPER_PADDING - 6, PAPER_PADDING + 26);

  const leftX = PAPER_PADDING;
  const rightX = PAPER_PADDING + SLOT_WIDTH + COLUMN_GAP;
  const topY = PAPER_PADDING + HEADER_HEIGHT;
  const bottomY = topY + SLOT_HEIGHT + CENTER_BAND_HEIGHT;
  const slotPositions = [
    { x: leftX, y: topY },
    { x: rightX, y: topY },
    { x: leftX, y: bottomY },
    { x: rightX, y: bottomY }
  ];

  loadedImages.forEach((image, index) => {
    const slot = slotPositions[index];
    if (!slot) {
      return;
    }

    context.fillStyle = "#d9d9dd";
    context.fillRect(slot.x, slot.y, SLOT_WIDTH, SLOT_HEIGHT);
    drawImageCover(context, image, slot.x, slot.y, SLOT_WIDTH, SLOT_HEIGHT);

    context.strokeStyle = "rgba(16, 35, 63, 0.06)";
    context.lineWidth = 2;
    context.strokeRect(slot.x, slot.y, SLOT_WIDTH, SLOT_HEIGHT);
  });

  const bandY = topY + SLOT_HEIGHT + Math.round((CENTER_BAND_HEIGHT - 28) / 2);
  context.strokeStyle = "rgba(16, 35, 63, 0.14)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(PAPER_PADDING, bandY - 10);
  context.lineTo(CANVAS_WIDTH - PAPER_PADDING, bandY - 10);
  context.moveTo(PAPER_PADDING, bandY + 18);
  context.lineTo(CANVAS_WIDTH - PAPER_PADDING, bandY + 18);
  context.stroke();

  context.fillStyle = "#7a828f";
  context.font = "700 12px Pretendard, SUIT, sans-serif";
  context.textAlign = "center";
  context.fillText("MEMORY FRAME", CANVAS_WIDTH / 2 - 155, bandY + 8);
  context.fillText("KEEP YOURSELF ALIVE", CANVAS_WIDTH / 2 + 110, bandY + 8);

  context.strokeStyle = "rgba(16, 35, 63, 0.14)";
  context.lineWidth = 2;
  context.strokeRect(PAPER_PADDING, PAPER_PADDING, INNER_WIDTH, CANVAS_HEIGHT - PAPER_PADDING * 2);

  context.fillStyle = "#677791";
  context.font = "600 14px Pretendard, SUIT, sans-serif";
  context.fillText(getFooterText(), CANVAS_WIDTH / 2, CANVAS_HEIGHT - PAPER_PADDING - 24);
}

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
  const pad = (value: number) => String(value).padStart(2, "0");
  const stamp = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join("");
  const time = [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join("");
  const extension = format === "png" ? "png" : "jpg";

  return `life4cut-${stamp}-${time}.${extension}`;
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("이미지 파일 생성에 실패했습니다."));
        return;
      }

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

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const imageRatio = image.width / image.height;
  const frameRatio = width / height;

  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;

  // 인생 4컷 스트립의 고정 비율에 맞춰 중앙 기준으로 잘라냅니다.
  if (imageRatio > frameRatio) {
    sourceWidth = image.height * frameRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / frameRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function getFooterText() {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return `${formatter.format(new Date())} | MADE WITH PIC MOMENT`;
}

function drawGridBackground(context: CanvasRenderingContext2D, width: number, height: number) {
  context.save();
  context.strokeStyle = "rgba(16, 35, 63, 0.05)";
  context.lineWidth = 1;

  for (let x = 0; x <= width; x += 20) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let y = 0; y <= height; y += 20) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  context.restore();
}
