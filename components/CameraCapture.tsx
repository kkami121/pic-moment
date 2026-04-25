"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CAMERA_FILTERS,
  type CameraFilter,
  type CameraErrorKey,
  DRAFT_STORAGE_KEY,
  RESULT_STORAGE_KEY,
  captureFrameToDataUrl,
  getCameraErrorKey,
  getCameraStream,
  stopMediaStream
} from "@/lib/camera";
import { useT } from "@/lib/localeContext";
import styles from "./CameraCapture.module.css";

const REQUIRED_SHOTS = 4;

export default function CameraCapture() {
  const router = useRouter();
  const t = useT();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const swipeStartX = useRef<number | null>(null);

  const [shots, setShots] = useState<string[]>([]);
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null);
  const [previewShot, setPreviewShot] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(CAMERA_FILTERS[0]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cameraError = useCallback((key: CameraErrorKey) => t[key], [t]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const savedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!savedDraft) {
      return;
    }

    try {
      const parsed = JSON.parse(savedDraft);
      if (Array.isArray(parsed)) {
        setShots(parsed.filter((item): item is string => typeof item === "string").slice(0, REQUIRED_SHOTS));
      }
    } catch {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (shots.length > 0) {
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(shots));
      return;
    }

    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  }, [shots]);

  const requestCamera = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    stopMediaStream(streamRef.current);
    streamRef.current = null;

    try {
      const mediaStream = await getCameraStream();
      const videoElement = videoRef.current;

      streamRef.current = mediaStream;

      if (!videoElement) {
        throw new Error("cameraPreviewMissing");
      }

      videoElement.srcObject = mediaStream;

      await new Promise<void>((resolve) => {
        const handleLoaded = () => {
          videoElement.removeEventListener("loadedmetadata", handleLoaded);
          void videoElement.play().catch(() => undefined);
          resolve();
        };

        if (videoElement.readyState >= 1) {
          void videoElement.play().catch(() => undefined);
          resolve();
          return;
        }

        videoElement.addEventListener("loadedmetadata", handleLoaded);
      });
    } catch (error) {
      setErrorMessage(cameraError(getCameraErrorKey(error)));
    } finally {
      setIsLoading(false);
    }
  }, [cameraError]);

  useEffect(() => {
    void requestCamera();

    return () => {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    };
  }, [requestCamera]);

  const handleCapture = useCallback(() => {
    const videoElement = videoRef.current;
    const captureCanvas = captureCanvasRef.current;

    if (!videoElement || !captureCanvas) {
      setErrorMessage(t.captureNotReady);
      return;
    }

    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      setErrorMessage(t.cameraVideoLoading);
      return;
    }

    setIsCapturing(true);

    try {
      const imageDataUrl = captureFrameToDataUrl(videoElement, captureCanvas, selectedFilter!.css);

      setShots((previousShots) => {
        const nextShots = [...previousShots];

        if (retakeIndex !== null) {
          nextShots[retakeIndex] = imageDataUrl;
          return nextShots;
        }

        if (nextShots.length < REQUIRED_SHOTS) {
          nextShots.push(imageDataUrl);
        }

        return nextShots;
      });

      setRetakeIndex(null);
    } catch (error) {
      setErrorMessage(cameraError(getCameraErrorKey(error)));
    } finally {
      setIsCapturing(false);
    }
  }, [retakeIndex, selectedFilter, t, cameraError]);


  const handleGoToResult = useCallback(() => {
    sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(shots));
    router.push("/result");
  }, [router, shots]);

  const handleRetakeMode = useCallback((index: number) => {
    setRetakeIndex(index);
  }, []);

  const handleSwipeStart = useCallback((e: { clientX: number }) => {
    swipeStartX.current = e.clientX;
  }, []);

  const handleSwipeEnd = useCallback((e: { clientX: number }) => {
    if (swipeStartX.current === null) return;
    const deltaX = e.clientX - swipeStartX.current;
    swipeStartX.current = null;

    if (Math.abs(deltaX) < 40) return;

    setSelectedFilter((prev: CameraFilter) => {
      const currentIndex = CAMERA_FILTERS.findIndex((f) => f.id === prev.id);
      if (deltaX < 0) {
        return CAMERA_FILTERS[(currentIndex + 1) % CAMERA_FILTERS.length];
      } else {
        return CAMERA_FILTERS[(currentIndex - 1 + CAMERA_FILTERS.length) % CAMERA_FILTERS.length];
      }
    });
  }, []);

  if (!isMounted) {
    return (
      <section className="panelCard" style={{ padding: 24 }}>
        <div className="statusMessage" data-tone="info">
          {t.cameraInitializing}
        </div>
      </section>
    );
  }

  return (
    <>
    <section className={styles.layout}>
      <div className={`panelCard ${styles.cameraCard}`}>
        <div
          className={styles.previewFrame}
          onPointerDown={handleSwipeStart}
          onPointerUp={handleSwipeEnd}
          onPointerLeave={() => { swipeStartX.current = null; }}
        >
          <div className={styles.captureBadge}>
            <span>
              {retakeIndex !== null
                ? t.retakingLabel.replace("{n}", String(retakeIndex + 1))
                : t.livePreview}
            </span>
          </div>

          <div className={styles.filterIndicator}>
            <button
              type="button"
              className={styles.filterArrow}
              onClick={() => setSelectedFilter((prev: CameraFilter) => {
                const i = CAMERA_FILTERS.findIndex((f) => f.id === prev.id);
                return CAMERA_FILTERS[(i - 1 + CAMERA_FILTERS.length) % CAMERA_FILTERS.length];
              })}
            >‹</button>
            <span className={styles.filterName}>{t.filterNames[selectedFilter!.id] ?? selectedFilter!.name}</span>
            <button
              type="button"
              className={styles.filterArrow}
              onClick={() => setSelectedFilter((prev: CameraFilter) => {
                const i = CAMERA_FILTERS.findIndex((f) => f.id === prev.id);
                return CAMERA_FILTERS[(i + 1) % CAMERA_FILTERS.length];
              })}
            >›</button>
          </div>

          <video ref={videoRef} autoPlay playsInline muted style={{ filter: selectedFilter!.css === "none" ? undefined : selectedFilter!.css }} />

          {(isLoading || errorMessage) && (
            <div className={styles.previewFallback}>
              <div>
                {isLoading && <p>{t.cameraLoading}</p>}
                {errorMessage && (
                  <div className="statusMessage" data-tone="error">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.captureActions}>
          <button
            type="button"
            className="primaryButton"
            onClick={handleCapture}
            disabled={isLoading || isCapturing || (!!errorMessage && shots.length === 0) || (shots.length >= REQUIRED_SHOTS && retakeIndex === null)}
          >
            {retakeIndex !== null
              ? t.retakeButtonLabel.replace("{n}", String(retakeIndex + 1))
              : t.captureButton}
          </button>
        </div>

        <canvas ref={captureCanvasRef} hidden />
      </div>

      <aside className={`panelCard ${styles.sideCard}`}>
        <div className={styles.sideHead}>
          <div>
            <span className="eyebrow">{t.photoStatusEyebrow}</span>
            <h2>{t.shootingStatus}</h2>
          </div>
          <span className="chip">
            {t.shotsCompleteLabel
              .replace("{shots}", String(shots.length))
              .replace("{total}", String(REQUIRED_SHOTS))}
          </span>
        </div>

        <div className={styles.shotGrid}>
          {Array.from({ length: REQUIRED_SHOTS }).map((_, index) => {
            const shot = shots[index];
            const isRetaking = retakeIndex === index;

            return (
              <article key={index} className={`${styles.shotCard} ${isRetaking ? styles.retakeRing : ""}`}>
                <div className={styles.shotHeader}>
                  <span className={styles.shotLabel}>
                    {t.cutLabel.replace("{n}", String(index + 1))}
                  </span>
                  {shot ? (
                    <button
                      type="button"
                      className={styles.retakeButton}
                      onClick={() => handleRetakeMode(index)}
                    >
                      {t.retakeLabel}
                    </button>
                  ) : (
                    <span className="chip">{t.waitingLabel}</span>
                  )}
                </div>

                <div className={styles.shotThumbWrap}>
                  {shot ? (
                    <button
                      type="button"
                      className={styles.thumbButton}
                      onClick={() => setPreviewShot(shot)}
                      aria-label={t.cutLabel.replace("{n}", String(index + 1))}
                    >
                      <img src={shot} alt={t.cutLabel.replace("{n}", String(index + 1))} />
                    </button>
                  ) : (
                    <div className={styles.shotEmpty}>{t.shotEmptyText}</div>
                  )}
                </div>

              </article>
            );
          })}
        </div>

        <div className={styles.completePanel}>
          <button
            type="button"
            className="primaryButton"
            onClick={handleGoToResult}
            disabled={shots.length !== REQUIRED_SHOTS}
          >
            {t.finishButton}
          </button>
        </div>
      </aside>
    </section>

    {previewShot && (
      <div className={styles.lightboxOverlay} onClick={() => setPreviewShot(null)}>
        <button
          type="button"
          className={styles.lightboxClose}
          onClick={() => setPreviewShot(null)}
          aria-label="닫기"
        >
          ✕
        </button>
        <img
          src={previewShot}
          alt="확대 미리보기"
          className={styles.lightboxImg}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )}
    </>
  );
}
