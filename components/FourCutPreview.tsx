"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DRAFT_STORAGE_KEY,
  FOURCUT_THEMES,
  RESULT_STORAGE_KEY,
  buildLife4CutFilename,
  downloadCanvasImage,
  renderFourCutToCanvas,
  type FourCutTheme,
} from "@/lib/canvas";
import styles from "./FourCutPreview.module.css";

const REQUIRED_SHOTS = 4;

const STICKER_OPTIONS = [
  "🌸", "✨", "💫", "🌟", "💝", "🎀", "🌈", "🦋",
  "🌙", "⭐", "🍀", "🌺", "💐", "🎊", "🎉", "🫧",
  "🩷", "🩵", "💛", "🤍",
];

export default function FourCutPreview() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [shots, setShots] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<FourCutTheme>(FOURCUT_THEMES[0]!);
  const [stickers, setStickers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"frame" | "sticker">("frame");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const storedImages = sessionStorage.getItem(RESULT_STORAGE_KEY);

    if (!storedImages) {
      setShots([]);
      setIsRendering(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedImages);
      if (Array.isArray(parsed)) {
        setShots(parsed.filter((item): item is string => typeof item === "string").slice(0, REQUIRED_SHOTS));
      } else {
        setShots([]);
      }
    } catch {
      setShots([]);
    } finally {
      setIsRendering(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const renderCanvas = async () => {
      if (shots.length !== REQUIRED_SHOTS || !canvasRef.current) return;

      setIsRendering(true);
      setErrorMessage(null);

      try {
        await renderFourCutToCanvas(canvasRef.current, shots, { theme: selectedTheme, stickers });
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : "이미지를 합성하는 중 오류가 발생했습니다.");
        }
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    };

    void renderCanvas();

    return () => {
      isCancelled = true;
    };
  }, [shots, selectedTheme, stickers]);

  const handleDownload = async (format: "png" | "jpeg") => {
    if (!canvasRef.current) return;
    try {
      setErrorMessage(null);
      await downloadCanvasImage(canvasRef.current, format, buildLife4CutFilename(format));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "다운로드에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleRestart = () => {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    sessionStorage.removeItem(RESULT_STORAGE_KEY);
    router.push("/camera");
  };

  const toggleSticker = useCallback((emoji: string) => {
    setStickers((prev) => {
      if (prev.includes(emoji)) return prev.filter((s) => s !== emoji);
      if (prev.length >= 5) return prev;
      return [...prev, emoji];
    });
  }, []);

  if (!isMounted) {
    return (
      <section className={`panelCard ${styles.emptyState}`}>
        <div className="statusMessage" data-tone="info">결과 화면을 준비하고 있습니다.</div>
      </section>
    );
  }

  if (shots.length !== REQUIRED_SHOTS) {
    return (
      <section className={`panelCard ${styles.emptyState}`}>
        <div className="statusMessage" data-tone="info">
          아직 4장의 촬영 데이터가 없습니다. 카메라 화면으로 이동해 4장을 모두 촬영한 뒤 결과를 확인해 주세요.
        </div>
        <p>모바일 브라우저에서는 새로고침 시 세션 데이터가 사라질 수 있으니, 촬영 직후 바로 저장하는 것을 권장합니다.</p>
        <button type="button" className="primaryButton" onClick={() => router.push("/camera")}>
          촬영 화면으로 이동
        </button>
      </section>
    );
  }

  return (
    <section className={styles.layout}>
      <div className={`panelCard ${styles.previewCard}`}>
        <div className={styles.canvasWrap}>
          <canvas ref={canvasRef} className={styles.previewCanvas} />
          {isRendering && (
            <div className={styles.renderingOverlay}>
              <span>합성 중...</span>
            </div>
          )}
        </div>
      </div>

      <aside className={`panelCard ${styles.decorCard}`}>
        <div className={styles.tabBar}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "frame" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("frame")}
          >
            프레임
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "sticker" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("sticker")}
          >
            스티커
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "frame" && (
            <div className={styles.themeGrid}>
              {FOURCUT_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`${styles.themeSwatch} ${selectedTheme.id === theme.id ? styles.themeSelected : ""}`}
                  onClick={() => setSelectedTheme(theme)}
                  aria-label={theme.name}
                >
                  <span className={styles.swatchPreview}>
                    <span style={{ background: theme.frameColor }} />
                    <span style={{ background: theme.accentColor }} />
                    <span style={{ background: theme.paperColor }} />
                  </span>
                  <span className={styles.swatchName}>{theme.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === "sticker" && (
            <>
              <p className={styles.stickerHint}>최대 5개 선택 · 중간 띠에 배치됩니다</p>
              <div className={styles.stickerGrid}>
                {STICKER_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`${styles.stickerBtn} ${stickers.includes(emoji) ? styles.stickerSelected : ""}`}
                    onClick={() => toggleSticker(emoji)}
                    aria-label={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {stickers.length > 0 && (
                <button type="button" className={styles.clearBtn} onClick={() => setStickers([])}>
                  선택 초기화
                </button>
              )}
            </>
          )}
        </div>

        <div className={styles.actions}>
          {errorMessage && (
            <div className="statusMessage" data-tone="error">{errorMessage}</div>
          )}
          <button type="button" className="primaryButton" onClick={() => handleDownload("png")} disabled={isRendering}>
            PNG 다운로드
          </button>
          <button type="button" className="secondaryButton" onClick={() => handleDownload("jpeg")} disabled={isRendering}>
            JPG 다운로드
          </button>
          <button type="button" className="ghostButton" onClick={handleRestart}>
            다시 촬영하기
          </button>
        </div>
      </aside>
    </section>
  );
}
