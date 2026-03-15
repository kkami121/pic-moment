import Link from "next/link";
import CameraCapture from "@/components/CameraCapture";
import styles from "./camera.module.css";

export default function CameraPage() {
  return (
    <main className={`appShell ${styles.pageShell}`}>
      <div className={`contentWrap ${styles.page}`}>
        <CameraCapture />
      </div>
    </main>
  );
}
