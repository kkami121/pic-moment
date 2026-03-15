import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className="appShell">
      <div className={`contentWrap ${styles.hero}`}>
        <section className={`glassCard ${styles.heroPanel}`}>
          <span className="eyebrow">PIC MOMENT</span>
          <h1 className="sectionTitle">당신의 오늘을 인생 4컷으로 남겨보세요.</h1>
          <p className="sectionText">
            별도 앱 설치 없이 브라우저에서 바로 촬영하고, 4장의 사진을 세로형 포토부스
            이미지로 합성해 다운로드할 수 있어요.
          </p>

          <div className={styles.heroActions}>
            <Link href="/camera" className="primaryButton">
              시작하기
            </Link>
            <a href="#features" className="ghostButton">
              서비스 소개
            </a>
          </div>

          <div className={styles.heroMeta}>
            <span className="chip">모바일/PC 카메라 지원</span>
            <span className="chip">Canvas 기반 4컷 합성</span>
            <span className="chip">PNG / JPG 다운로드</span>
          </div>
        </section>

        <aside className={`glassCard ${styles.stripCard}`}>
          <div className={styles.stripGlow} />
          <span className="eyebrow" style={{ color: "#ffd8c9" }}>
            LIFE 4 CUT
          </span>
          <div className={styles.stripPaper}>
            <div className={styles.stripTitle}>PIC MOMENT</div>
            <div className={styles.stripSlots}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={styles.stripSlot} />
              ))}
            </div>
            <div className={styles.stripFooter}>MAKE YOUR OWN STRIP</div>
          </div>
        </aside>
      </div>

      <section id="features" className="contentWrap" style={{ marginTop: 24 }}>
        <div className={styles.featureGrid}>
          <article className={`panelCard ${styles.featureCard}`}>
            <h3>촬영부터 결과까지 한 번에</h3>
            <p>4장의 사진을 순서대로 촬영하고, 필요하면 원하는 컷만 다시 찍을 수 있어요.</p>
          </article>
          <article className={`panelCard ${styles.featureCard}`}>
            <h3>실제 서비스 같은 감성</h3>
            <p>세로형 스트립 레이아웃, 깔끔한 카드 UI, 반응형 인터페이스를 함께 제공합니다.</p>
          </article>
          <article className={`panelCard ${styles.featureCard}`}>
            <h3>AWS 배포 확장 고려</h3>
            <p>Next.js standalone 빌드와 Dockerfile 기반으로 손쉽게 서버 환경으로 확장할 수 있어요.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
