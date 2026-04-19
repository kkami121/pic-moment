export const DRAFT_STORAGE_KEY = "life4cut-draft-images";
export const RESULT_STORAGE_KEY = "life4cut-images";

export type CameraFilter = { id: string; name: string; css: string };

export const CAMERA_FILTERS: CameraFilter[] = [
  { id: "none",    name: "없음",    css: "none" },
  { id: "bw",      name: "흑백",    css: "grayscale(100%)" },
  { id: "sepia",   name: "세피아",  css: "sepia(80%)" },
  { id: "warm",    name: "따뜻하게", css: "sepia(30%) saturate(1.5) brightness(1.05)" },
  { id: "vivid",   name: "선명하게", css: "saturate(1.9) contrast(1.1)" },
  { id: "bright",  name: "밝게",    css: "brightness(1.35) contrast(0.85)" },
  { id: "cool",    name: "차갑게",  css: "saturate(0.75) hue-rotate(20deg) brightness(1.05)" },
  { id: "vintage", name: "빈티지",  css: "sepia(50%) contrast(1.15) brightness(0.88) saturate(0.8)" },
];

export async function getCameraStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("이 브라우저는 카메라 기능을 지원하지 않습니다. 최신 Chrome, Safari, Edge 브라우저를 사용해 주세요.");
  }

  const preferredConstraints: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: { ideal: "user" },
      width: { ideal: 1080 },
      height: { ideal: 1440 },
      aspectRatio: { ideal: 3 / 4 }
    }
  };

  try {
    return await navigator.mediaDevices.getUserMedia(preferredConstraints);
  } catch (firstError) {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    } catch {
      throw firstError;
    }
  }
}

export function stopMediaStream(stream: MediaStream | null | undefined) {
  stream?.getTracks().forEach((track) => track.stop());
}

const CAPTURE_RATIO = 3 / 4; // width / height — 미리보기와 동일한 3:4 비율

export function captureFrameToDataUrl(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement, filterCss?: string) {
  const width = videoElement.videoWidth;
  const height = videoElement.videoHeight;

  if (!width || !height) {
    throw new Error("카메라 영상을 읽지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }

  // 카메라 원본을 3:4 비율로 중앙 크롭 — 미리보기에서 보이는 영역과 일치시킵니다.
  let srcX = 0, srcY = 0, srcW = width, srcH = height;
  const frameRatio = width / height;

  if (frameRatio > CAPTURE_RATIO) {
    srcW = Math.round(height * CAPTURE_RATIO);
    srcX = Math.round((width - srcW) / 2);
  } else if (frameRatio < CAPTURE_RATIO) {
    srcH = Math.round(width / CAPTURE_RATIO);
    srcY = Math.round((height - srcH) / 2);
  }

  canvasElement.width = srcW;
  canvasElement.height = srcH;

  const context = canvasElement.getContext("2d");
  if (!context) {
    throw new Error("캔버스를 초기화하지 못했습니다.");
  }

  context.save();
  if (filterCss && filterCss !== "none") {
    context.filter = filterCss;
  }
  context.translate(srcW, 0);
  context.scale(-1, 1);
  context.drawImage(videoElement, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
  context.restore();
  return canvasElement.toDataURL("image/jpeg", 0.94);
}

export type CameraErrorKey =
  | "cameraNotSupported"
  | "cameraPermissionDenied"
  | "cameraNotFound"
  | "cameraBusy"
  | "cameraOverconstrained"
  | "cameraSecurity"
  | "cameraGeneric"
  | "cameraPreviewMissing"
  | "cameraVideoLoading"
  | "captureNotReady";

export function getCameraErrorKey(error: unknown): CameraErrorKey {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") return "cameraPermissionDenied";
    if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") return "cameraNotFound";
    if (error.name === "NotReadableError" || error.name === "TrackStartError") return "cameraBusy";
    if (error.name === "OverconstrainedError") return "cameraOverconstrained";
    if (error.name === "SecurityError") return "cameraSecurity";
  }
  return "cameraGeneric";
}

export function getCameraErrorMessage(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      return "카메라 권한이 거부되었습니다. 브라우저 주소창 옆의 권한 설정에서 카메라 접근을 허용해 주세요.";
    }

    if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      return "사용 가능한 카메라를 찾지 못했습니다. 다른 카메라가 연결되어 있는지 확인해 주세요.";
    }

    if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      return "카메라가 이미 다른 앱에서 사용 중일 수 있습니다. 다른 카메라 앱을 종료한 뒤 다시 시도해 주세요.";
    }

    if (error.name === "OverconstrainedError") {
      return "현재 기기에서 지원하지 않는 카메라 설정입니다. 브라우저를 새로고침한 뒤 다시 시도해 주세요.";
    }

    if (error.name === "SecurityError") {
      return "보안 설정 때문에 카메라에 접근할 수 없습니다. HTTPS 환경 또는 localhost에서 접속해 주세요.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "카메라를 사용할 수 없습니다. 브라우저를 새로고침하거나 다른 브라우저에서 다시 시도해 주세요.";
}
