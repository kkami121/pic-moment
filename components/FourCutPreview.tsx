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
import { useT } from "@/lib/localeContext";
import styles from "./FourCutPreview.module.css";

const REQUIRED_SHOTS = 4;

const STICKER_OPTIONS = [
  "🌸", "✨", "💫", "🌟", "💝", "🎀", "🌈", "🦋",
  "🌙", "⭐", "🍀", "🌺", "💐", "🎊", "🎉", "🫧",
  "🩷", "🩵", "💛", "🤍",
];

export default function FourCutPreview() {
  const router = useRouter();
  const t = useT();
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
          setErrorMessage(t.renderError);
        }
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    };

    void renderCanvas();

    return () => {
      isCancelled = true;
    };
  }, [shots, selectedTheme, stickers, t.renderError]);

  const handleDownload = async (format: "png" | "jpeg") => {
    if (!canvasRef.current) return;
    try {
      setErrorMessage(null);
      await downloadCanvasImage(canvasRef.current, format, buildLife4CutFilename(format));
    } catch {
      setErrorMessage(t.downloadError);
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
        <div className="statusMessage" data-tone="info">{t.resultInitializing}</div>
      </section>
    );
  }

  if (shots.length !== REQUIRED_SHOTS) {
    return (
      <section className={`panelCard ${styles.emptyState}`}>
        <div className="statusMessage" data-tone="info">{t.resultNoShots}</div>
        <p>{t.resultMobileHint}</p>
        <button type="button" className="primaryButton" onClick={() => router.push("/camera")}>
          {t.goToCamera}
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
              <span>{t.rendering}</span>
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
            {t.frameTab}
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "sticker" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("sticker")}
          >
            {t.stickerTab}
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
              <p className={styles.stickerHint}>{t.stickerHint}</p>
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
                  {t.clearSelection}
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
            {t.downloadPng}
          </button>
          <button type="button" className="secondaryButton" onClick={() => handleDownload("jpeg")} disabled={isRendering}>
            {t.downloadJpg}
          </button>
          <button type="button" className="ghostButton" onClick={handleRestart}>
            {t.reshoot}
          </button>
        </div>
      </aside>
    </section>
  );
}
