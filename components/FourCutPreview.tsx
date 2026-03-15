"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  DRAFT_STORAGE_KEY,
  RESULT_STORAGE_KEY,
  buildLife4CutFilename,
  downloadCanvasImage,
  renderFourCutToCanvas
} from "@/lib/canvas";
import styles from "./FourCutPreview.module.css";

const REQUIRED_SHOTS = 4;

export default function FourCutPreview() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [shots, setShots] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);

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
      if (shots.length !== REQUIRED_SHOTS || !canvasRef.current) {
        return;
      }

      setIsRendering(true);
      setErrorMessage(null);

      try {
        // 클라이언트에서만 Canvas 합성을 수행해 브라우저 저장 흐름과 자연스럽게 연결합니다.
        await renderFourCutToCanvas(canvasRef.current, shots);
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : "이미지를 합성하는 중 오류가 발생했습니다.");
        }
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    };

    void renderCanvas();

    return () => {
      isCancelled = true;
    };
  }, [shots]);

  const handleDownload = async (format: "png" | "jpeg") => {
    if (!canvasRef.current) {
      return;
    }

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
        </div>

        <div className={styles.buttonRow}>
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

        {isRendering && (
          <div className="statusMessage" data-tone="info" style={{ marginTop: 16 }}>
            4컷 이미지를 합성하고 있습니다.
          </div>
        )}

        {errorMessage && (
          <div className="statusMessage" data-tone="error" style={{ marginTop: 16 }}>
            {errorMessage}
          </div>
        )}
      </div>

      <aside className={`panelCard ${styles.infoCard}`}>
        <span className="eyebrow">Preview Detail</span>
        <h2 style={{ margin: "10px 0 0", fontSize: 28 }}>다운로드 전 확인</h2>
        <p className="sectionText" style={{ marginTop: 12 }}>
          포토 스트립은 고정 비율의 세로형 캔버스로 생성됩니다. 다운로드 파일명은 촬영 시각 기준
          `life4cut-YYYYMMDD-HHmmss` 형식으로 저장됩니다.
        </p>

        <div className={styles.shotList}>
          {shots.map((shot, index) => (
            <div key={index} className={styles.shotItem}>
              <img src={shot} alt={`${index + 1}번째 컷 썸네일`} />
              <div>
                <strong>{index + 1}번째 컷</strong>
                <span style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                  촬영한 순서대로 세로 스트립에 배치됩니다.
                </span>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}
