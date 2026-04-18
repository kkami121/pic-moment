"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CAMERA_FILTERS,
  type CameraFilter,
  DRAFT_STORAGE_KEY,
  RESULT_STORAGE_KEY,
  captureFrameToDataUrl,
  getCameraErrorMessage,
  getCameraStream,
  stopMediaStream
} from "@/lib/camera";
import styles from "./CameraCapture.module.css";

const REQUIRED_SHOTS = 4;

export default function CameraCapture() {
  const router = useRouter();
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
        throw new Error("카메라 미리보기 요소를 찾을 수 없습니다.");
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
      setErrorMessage(getCameraErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      setErrorMessage("카메라 캡처 준비가 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      setErrorMessage("카메라 화면을 아직 불러오는 중입니다. 잠시 후 다시 촬영해 주세요.");
      return;
    }

    setIsCapturing(true);

    try {
      const imageDataUrl = captureFrameToDataUrl(videoElement, captureCanvas, selectedFilter.css);

      setShots((previousShots) => {
        const nextShots = [...previousShots];

        // 재촬영 모드에서는 기존 슬롯을 교체하고, 일반 촬영은 뒤에 이어 붙입니다.
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
      setErrorMessage(getCameraErrorMessage(error));
    } finally {
      setIsCapturing(false);
    }
  }, [retakeIndex, selectedFilter]);


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
          카메라 화면을 준비하고 있습니다.
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
            <span>{retakeIndex !== null ? `${retakeIndex + 1}번째 재촬영 중` : "실시간 미리보기"}</span>
          </div>

          <div className={styles.filterIndicator}>
            <span className={styles.filterArrow}>‹</span>
            <span className={styles.filterName}>{selectedFilter.name}</span>
            <span className={styles.filterArrow}>›</span>
          </div>

          <video ref={videoRef} autoPlay playsInline muted style={{ filter: selectedFilter.css === "none" ? undefined : selectedFilter.css }} />

          {(isLoading || errorMessage) && (
            <div className={styles.previewFallback}>
              <div>
                {isLoading && <p>카메라를 준비하고 있어요. 잠시만 기다려 주세요.</p>}
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
            {retakeIndex !== null ? `${retakeIndex + 1}번째 컷 재촬영` : "사진 촬영하기"}
          </button>
        </div>

        {/*<p className={styles.helperText}>
          권한 거부 시 브라우저 설정에서 카메라 접근을 다시 허용해 주세요.
        </p>*/}
        
        <canvas ref={captureCanvasRef} hidden />
      </div>

      <aside className={`panelCard ${styles.sideCard}`}>
        <div className={styles.sideHead}>
          <div>
            <span className="eyebrow">Poto Status</span>
            <h2>촬영 현황</h2>
          </div>
          <span className="chip">
            {shots.length} / {REQUIRED_SHOTS}장 완료
          </span>
        </div>

        <div className={styles.shotGrid}>
          {Array.from({ length: REQUIRED_SHOTS }).map((_, index) => {
            const shot = shots[index];
            const isRetaking = retakeIndex === index;

            return (
              <article key={index} className={`${styles.shotCard} ${isRetaking ? styles.retakeRing : ""}`}>
                <div className={styles.shotHeader}>
                  <span className={styles.shotLabel}>{index + 1}번째 컷</span>
                  {shot ? (
                    <button
                      type="button"
                      className={styles.retakeButton}
                      onClick={() => handleRetakeMode(index)}
                    >
                      재촬영
                    </button>
                  ) : (
                    <span className="chip">대기 중</span>
                  )}
                </div>

                <div className={styles.shotThumbWrap}>
                  {shot ? (
                    <button
                      type="button"
                      className={styles.thumbButton}
                      onClick={() => setPreviewShot(shot)}
                      aria-label={`${index + 1}번째 컷 확대 보기`}
                    >
                      <img src={shot} alt={`${index + 1}번째 촬영 결과`} />
                    </button>
                  ) : (
                    <div className={styles.shotEmpty}>촬영하면 이 위치에 사진이 표시됩니다.</div>
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
            촬영 마무리
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
