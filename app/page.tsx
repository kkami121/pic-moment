import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations } from "@/lib/translations/index";
import styles from "./page.module.css";

export default async function HomePage() {
  const locale = (await cookies()).get("NEXT_LOCALE")?.value ?? "ko";
  const t = getTranslations(locale);

  return (
    <main className={`appShell ${styles.page}`}>
      <div className={`contentWrap ${styles.hero}`}>
        <section className={`glassCard ${styles.heroPanel}`}>
          <h1 className="sectionTitle"><span className="eyebrow2">PIC MOMENT</span></h1>
          <h1 className="sectionTitle">{t.heroTitle}</h1>
          <p className="sectionText">{t.heroDesc}</p>

          <div className={styles.heroActions}>
            <Link href="/camera" className="primaryButton">
              {t.startButton}
            </Link>
          </div>

          <div id="service-info" className={styles.heroMeta}>
            <span className="chip">{t.chipCamera}</span>
            <span className="chip">{t.chipDownload}</span>
            <span className="chip">{t.chipFrames}</span>
            <span className="chip">{t.chipDecorate}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
