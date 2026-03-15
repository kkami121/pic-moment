import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={`appShell ${styles.page}`}>
      <div className={`contentWrap ${styles.hero}`}>
        <section className={`glassCard ${styles.heroPanel}`}>
          <h1 className="sectionTitle"><span className="eyebrow2">PIC MOMENT</span></h1>
          <h1 className="sectionTitle">당신의 오늘을 남겨보세요.</h1>
          <p className="sectionText">
            앱 설치 없이 브라우저에서 바로 촬영하고, 프레임을 선택후 
            이미지를 다운로드하세요.
          </p>

          <div className={styles.heroActions}>
            <Link href="/camera" className="primaryButton">
              시작하기
            </Link>
            {/* <a href="#service-info" className={`ghostButton ${styles.infoButton}`}>
              서비스 설명
            </a> */}
          </div>

          <div id="service-info" className={styles.heroMeta}>
            <span className="chip">모바일/PC 카메라 지원</span>
            <span className="chip">PNG / JPG 다운로드</span>
            <span className="chip">다양한 프레임 지원</span>
            <span className="chip">사진 꾸미기 가능</span>
          </div>
        </section>
      </div>
    </main>
  );
}
