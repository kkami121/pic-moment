import FourCutPreview from "@/components/FourCutPreview";
import styles from "./result.module.css";

export default function ResultPage() {
  return (
    <main className={`appShell ${styles.pageShell}`}>
      <div className={`contentWrap ${styles.page}`}>
        <FourCutPreview />
      </div>
    </main>
  );
}
