import Link from "next/link";
import FourCutPreview from "@/components/FourCutPreview";
import styles from "./result.module.css";

export default function ResultPage() {
  return (
    <main className="appShell">
      <div className={`contentWrap ${styles.page}`}>
        <section className={`glassCard ${styles.header}`}>
          <div>
            <span className="eyebrow">Result</span>
            <h1 style={{ margin: "10px 0 0", fontSize: "clamp(28px, 4vw, 42px)" }}>
              나만의 4컷 결과
            </h1>
            <p>촬영한 4장의 사진을 세로형 포토 스트립으로 합성했습니다. 미리보기 후 바로 저장할 수 있어요.</p>
          </div>
          <Link href="/camera" className="ghostButton">
            다시 촬영하기
          </Link>
        </section>

        <FourCutPreview />
      </div>
    </main>
  );
}
