export const DRAFT_STORAGE_KEY = "life4cut-draft-images";
export const RESULT_STORAGE_KEY = "life4cut-images";

type DownloadFormat = "png" | "jpeg";

const CANVAS_WIDTH = 900;
const PADDING = 48;
const SLOT_GAP = 24;
const HEADER_HEIGHT = 170;
const FOOTER_HEIGHT = 120;
const INNER_WIDTH = CANVAS_WIDTH - PADDING * 2;
const SLOT_HEIGHT = Math.round(INNER_WIDTH * 1.25);

export async function renderFourCutToCanvas(canvas: HTMLCanvasElement, images: string[]) {
  if (images.length !== 4) {
    throw new Error("4장의 이미지가 모두 필요합니다.");
  }

  const canvasHeight = PADDING * 2 + HEADER_HEIGHT + FOOTER_HEIGHT + SLOT_GAP * 3 + SLOT_HEIGHT * 4;
  canvas.width = CANVAS_WIDTH;
  canvas.height = canvasHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("합성용 캔버스를 초기화하지 못했습니다.");
  }

  const loadedImages = await Promise.all(images.map((image) => loadImage(image)));

  context.clearRect(0, 0, CANVAS_WIDTH, canvasHeight);
  context.fillStyle = "#fff6ee";
  context.fillRect(0, 0, CANVAS_WIDTH, canvasHeight);

  context.fillStyle = "#10233f";
  context.fillRect(PADDING / 2, PADDING / 2, CANVAS_WIDTH - PADDING, canvasHeight - PADDING);

  context.fillStyle = "#fffaf6";
  context.fillRect(PADDING, PADDING, INNER_WIDTH, canvasHeight - PADDING * 2);

  context.fillStyle = "#10233f";
  context.font = "700 52px Pretendard, SUIT, sans-serif";
  context.textAlign = "center";
  context.fillText("PIC MOMENT", CANVAS_WIDTH / 2, PADDING + 70);

  context.fillStyle = "#677791";
  context.font = "500 28px Pretendard, SUIT, sans-serif";
  context.fillText("LIFE 4 CUT", CANVAS_WIDTH / 2, PADDING + 115);

  loadedImages.forEach((image, index) => {
    const y = PADDING + HEADER_HEIGHT + index * (SLOT_HEIGHT + SLOT_GAP);

    context.fillStyle = "#f1ebe4";
    context.fillRect(PADDING, y, INNER_WIDTH, SLOT_HEIGHT);
    drawImageCover(context, image, PADDING, y, INNER_WIDTH, SLOT_HEIGHT);

    context.strokeStyle = "rgba(16, 35, 63, 0.08)";
    context.lineWidth = 2;
    context.strokeRect(PADDING, y, INNER_WIDTH, SLOT_HEIGHT);
  });

  context.strokeStyle = "rgba(16, 35, 63, 0.14)";
  context.lineWidth = 2;
  context.strokeRect(PADDING, PADDING, INNER_WIDTH, canvasHeight - PADDING * 2);

  context.fillStyle = "#677791";
  context.font = "500 24px Pretendard, SUIT, sans-serif";
  context.fillText(getFooterText(), CANVAS_WIDTH / 2, canvasHeight - PADDING - 40);
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
    link.remove();
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
