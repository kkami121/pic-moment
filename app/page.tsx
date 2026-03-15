import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={`appShell ${styles.page}`}>
      <div className={`contentWrap ${styles.hero}`}>
        <section className={`glassCard ${styles.heroPanel}`}>
          <span className="eyebrow">PIC MOMENT</span>
          <h1 className="sectionTitle">당신의 오늘을 <span className="eyebrow">PIC MOMENT</span>로 남겨보세요.</h1>
          <p className="sectionText">
            별도 앱 설치 없이 브라우저에서 바로 촬영하고, 4장의 사진을 2 x 2 포토부스
            이미지로 합성해 다운로드할 수 있어요.
          </p>

          <div className={styles.heroActions}>
            <Link href="/camera" className="primaryButton">
              시작하기
            </Link>
          </div>

          <div className={styles.heroMeta}>
            <span className="chip">모바일/PC 카메라 지원</span>
            <span className="chip">다양한 프레임 지원</span>
            <span className="chip">PNG / JPG 다운로드</span>
          </div>
        </section>
      </div>
    </main>
  );
}
