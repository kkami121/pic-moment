import Link from "next/link";
import CameraCapture from "@/components/CameraCapture";
import styles from "./camera.module.css";

export default function CameraPage() {
  return (
    <main className="appShell">
      <div className={`contentWrap ${styles.page}`}>
        <section className={`glassCard ${styles.topBar}`}>
          <div>
            <span className="eyebrow">Camera Booth</span>
            <h1 style={{ margin: "10px 0 0", fontSize: "clamp(28px, 4vw, 42px)" }}>
              인생 4컷 촬영
            </h1>
            <p>카메라 권한을 허용한 뒤 4장을 촬영하고, 필요한 컷은 다시 찍은 후 결과를 확인하세요.</p>
          </div>
          <Link href="/" className="ghostButton">
            메인으로
          </Link>
        </section>

        <CameraCapture />
      </div>
    </main>
  );
}
