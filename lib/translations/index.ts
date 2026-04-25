export type Translations = {
  // Home page
  heroTitle: string;
  heroDesc: string;
  startButton: string;
  chipCamera: string;
  chipDownload: string;
  chipFrames: string;
  chipDecorate: string;

  // Camera filter names (keyed by filter id)
  filterNames: Record<string, string>;

  // Camera page — status / badge
  cameraInitializing: string;
  cameraLoading: string;
  livePreview: string;
  retakingLabel: string;       // e.g. "Retaking Shot {n}" — replace {n} with number

  // Camera page — buttons
  captureButton: string;
  retakeButtonLabel: string;   // e.g. "Retake Shot {n}" — replace {n} with number
  finishButton: string;

  // Camera page — side panel
  photoStatusEyebrow: string;
  shootingStatus: string;
  shotsCompleteLabel: string;  // e.g. "{shots} / {total} shots done"
  cutLabel: string;            // e.g. "Shot {n}"
  retakeLabel: string;
  waitingLabel: string;
  shotEmptyText: string;

  // Result page
  resultInitializing: string;
  resultNoShots: string;
  resultMobileHint: string;
  goToCamera: string;
  rendering: string;
  frameTab: string;
  filterTab: string;
  downloadPng: string;
  downloadJpg: string;
  reshoot: string;
  renderError: string;
  downloadError: string;

  // Camera error messages
  cameraNotSupported: string;
  cameraPermissionDenied: string;
  cameraNotFound: string;
  cameraBusy: string;
  cameraOverconstrained: string;
  cameraSecurity: string;
  cameraGeneric: string;
  cameraPreviewMissing: string;
  cameraVideoLoading: string;
  captureNotReady: string;
};

// ─── Korean ───────────────────────────────────────────────────────────────────

const ko: Translations = {
  filterNames: { none: "없음", bw: "흑백", sepia: "세피아", warm: "따뜻하게", vivid: "선명하게", bright: "밝게", cool: "차갑게", vintage: "빈티지" },
  heroTitle: "당신의 오늘을 남겨보세요.",
  heroDesc: "앱 설치 없이 브라우저에서 바로 촬영하고, 프레임을 선택 후 이미지를 다운로드하세요.",
  startButton: "시작하기",
  chipCamera: "모바일/PC 카메라 지원",
  chipDownload: "PNG / JPG 다운로드",
  chipFrames: "다양한 프레임 지원",
  chipDecorate: "사진 꾸미기 가능",

  cameraInitializing: "카메라 화면을 준비하고 있습니다.",
  cameraLoading: "카메라를 준비하고 있어요. 잠시만 기다려 주세요.",
  livePreview: "실시간 미리보기",
  retakingLabel: "{n}번째 재촬영 중",

  captureButton: "사진 촬영하기",
  retakeButtonLabel: "{n}번째 컷 재촬영",
  finishButton: "촬영 마무리",

  photoStatusEyebrow: "Photo Status",
  shootingStatus: "촬영 현황",
  shotsCompleteLabel: "{shots} / {total}장 완료",
  cutLabel: "{n}번째 컷",
  retakeLabel: "재촬영",
  waitingLabel: "대기 중",
  shotEmptyText: "촬영하면 이 위치에 사진이 표시됩니다.",

  resultInitializing: "결과 화면을 준비하고 있습니다.",
  resultNoShots: "아직 4장의 촬영 데이터가 없습니다. 카메라 화면으로 이동해 4장을 모두 촬영한 뒤 결과를 확인해 주세요.",
  resultMobileHint: "모바일 브라우저에서는 새로고침 시 세션 데이터가 사라질 수 있으니, 촬영 직후 바로 저장하는 것을 권장합니다.",
  goToCamera: "촬영 화면으로 이동",
  rendering: "합성 중...",
  frameTab: "프레임",
  filterTab: "필터",
  downloadPng: "PNG 다운로드",
  downloadJpg: "JPG 다운로드",
  reshoot: "다시 촬영하기",
  renderError: "이미지를 합성하는 중 오류가 발생했습니다.",
  downloadError: "다운로드에 실패했습니다. 다시 시도해 주세요.",

  cameraNotSupported: "이 브라우저는 카메라 기능을 지원하지 않습니다. 최신 Chrome, Safari, Edge 브라우저를 사용해 주세요.",
  cameraPermissionDenied: "카메라 권한이 거부되었습니다. 브라우저 주소창 옆의 권한 설정에서 카메라 접근을 허용해 주세요.",
  cameraNotFound: "사용 가능한 카메라를 찾지 못했습니다. 다른 카메라가 연결되어 있는지 확인해 주세요.",
  cameraBusy: "카메라가 이미 다른 앱에서 사용 중일 수 있습니다. 다른 카메라 앱을 종료한 뒤 다시 시도해 주세요.",
  cameraOverconstrained: "현재 기기에서 지원하지 않는 카메라 설정입니다. 브라우저를 새로고침한 뒤 다시 시도해 주세요.",
  cameraSecurity: "보안 설정 때문에 카메라에 접근할 수 없습니다. HTTPS 환경 또는 localhost에서 접속해 주세요.",
  cameraGeneric: "카메라를 사용할 수 없습니다. 브라우저를 새로고침하거나 다른 브라우저에서 다시 시도해 주세요.",
  cameraPreviewMissing: "카메라 미리보기 요소를 찾을 수 없습니다.",
  cameraVideoLoading: "카메라 화면을 아직 불러오는 중입니다. 잠시 후 다시 촬영해 주세요.",
  captureNotReady: "카메라 캡처 준비가 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.",
};

// ─── English ──────────────────────────────────────────────────────────────────

const en: Translations = {
  filterNames: { none: "None", bw: "B&W", sepia: "Sepia", warm: "Warm", vivid: "Vivid", bright: "Bright", cool: "Cool", vintage: "Vintage" },
  heroTitle: "Capture your today.",
  heroDesc: "No app needed — shoot directly in your browser, pick a frame, and download your photo.",
  startButton: "Get Started",
  chipCamera: "Mobile & PC camera",
  chipDownload: "PNG / JPG download",
  chipFrames: "Multiple frames",
  chipDecorate: "Sticker decoration",

  cameraInitializing: "Preparing the camera...",
  cameraLoading: "Setting up the camera. Please wait a moment.",
  livePreview: "Live Preview",
  retakingLabel: "Retaking Shot {n}",

  captureButton: "Take Photo",
  retakeButtonLabel: "Retake Shot {n}",
  finishButton: "Finish",

  photoStatusEyebrow: "Photo Status",
  shootingStatus: "Shot Status",
  shotsCompleteLabel: "{shots} / {total} shots done",
  cutLabel: "Shot {n}",
  retakeLabel: "Retake",
  waitingLabel: "Waiting",
  shotEmptyText: "Your photo will appear here.",

  resultInitializing: "Preparing result...",
  resultNoShots: "No photos found. Please go back to the camera and take all 4 shots.",
  resultMobileHint: "On mobile, refreshing the page may clear session data. Save your photo right after shooting.",
  goToCamera: "Go to Camera",
  rendering: "Composing...",
  frameTab: "Frame",
  filterTab: "Filter",
  downloadPng: "Download PNG",
  downloadJpg: "Download JPG",
  reshoot: "Reshoot",
  renderError: "Failed to compose the image.",
  downloadError: "Download failed. Please try again.",

  cameraNotSupported: "Your browser doesn't support camera access. Please use Chrome, Safari, or Edge.",
  cameraPermissionDenied: "Camera access was denied. Please allow camera access in your browser settings.",
  cameraNotFound: "No camera found. Please check that a camera is connected.",
  cameraBusy: "The camera may be in use by another app. Close other camera apps and try again.",
  cameraOverconstrained: "The camera settings are not supported on this device. Please refresh and try again.",
  cameraSecurity: "Camera access is blocked by security settings. Please use HTTPS or localhost.",
  cameraGeneric: "Camera unavailable. Please refresh the page or try a different browser.",
  cameraPreviewMissing: "Camera preview element not found.",
  cameraVideoLoading: "Camera is still loading. Please wait and try again.",
  captureNotReady: "Camera capture is not ready. Please wait a moment and try again.",
};

// ─── Japanese ─────────────────────────────────────────────────────────────────

const ja: Translations = {
  filterNames: { none: "なし", bw: "モノクロ", sepia: "セピア", warm: "温かみ", vivid: "鮮やか", bright: "明るく", cool: "クール", vintage: "ビンテージ" },
  heroTitle: "あなたの今日を残しましょう。",
  heroDesc: "アプリ不要 — ブラウザで撮影して、フレームを選び、写真をダウンロードできます。",
  startButton: "はじめる",
  chipCamera: "モバイル・PC対応",
  chipDownload: "PNG / JPG ダウンロード",
  chipFrames: "多彩なフレーム",
  chipDecorate: "スタンプで飾り付け",

  cameraInitializing: "カメラを準備しています...",
  cameraLoading: "カメラを起動しています。少々お待ちください。",
  livePreview: "ライブプレビュー",
  retakingLabel: "{n}枚目を再撮影中",

  captureButton: "写真を撮る",
  retakeButtonLabel: "{n}枚目を再撮影",
  finishButton: "撮影完了",

  photoStatusEyebrow: "Photo Status",
  shootingStatus: "撮影状況",
  shotsCompleteLabel: "{shots} / {total}枚完了",
  cutLabel: "{n}枚目",
  retakeLabel: "再撮影",
  waitingLabel: "待機中",
  shotEmptyText: "ここに写真が表示されます。",

  resultInitializing: "結果を準備しています...",
  resultNoShots: "写真データがありません。カメラ画面に戻って4枚すべて撮影してください。",
  resultMobileHint: "モバイルでは再読み込み時にセッションデータが失われる場合があります。撮影直後に保存することをお勧めします。",
  goToCamera: "カメラに戻る",
  rendering: "合成中...",
  frameTab: "フレーム",
  filterTab: "フィルター",
  downloadPng: "PNG でダウンロード",
  downloadJpg: "JPG でダウンロード",
  reshoot: "撮り直す",
  renderError: "画像の合成中にエラーが発生しました。",
  downloadError: "ダウンロードに失敗しました。もう一度お試しください。",

  cameraNotSupported: "このブラウザはカメラ機能をサポートしていません。Chrome、Safari、Edge をご利用ください。",
  cameraPermissionDenied: "カメラのアクセスが拒否されました。ブラウザの設定でカメラへのアクセスを許可してください。",
  cameraNotFound: "カメラが見つかりません。カメラが接続されているか確認してください。",
  cameraBusy: "他のアプリがカメラを使用中の可能性があります。他のカメラアプリを終了してからお試しください。",
  cameraOverconstrained: "このデバイスではカメラ設定がサポートされていません。ページを更新してお試しください。",
  cameraSecurity: "セキュリティ設定によりカメラにアクセスできません。HTTPS または localhost でアクセスしてください。",
  cameraGeneric: "カメラを使用できません。ページを更新するか別のブラウザをお試しください。",
  cameraPreviewMissing: "カメラプレビュー要素が見つかりません。",
  cameraVideoLoading: "カメラがまだ読み込み中です。少々お待ちください。",
  captureNotReady: "カメラの準備ができていません。少々お待ちください。",
};

// ─── Chinese ──────────────────────────────────────────────────────────────────

const zh: Translations = {
  filterNames: { none: "无", bw: "黑白", sepia: "褪色", warm: "暖色", vivid: "鲜艳", bright: "明亮", cool: "冷色", vintage: "复古" },
  heroTitle: "记录你的今天。",
  heroDesc: "无需安装应用 — 直接在浏览器中拍照，选择边框，下载照片。",
  startButton: "开始",
  chipCamera: "支持手机和电脑",
  chipDownload: "PNG / JPG 下载",
  chipFrames: "多种边框",
  chipDecorate: "贴纸装饰",

  cameraInitializing: "正在准备摄像头...",
  cameraLoading: "正在启动摄像头，请稍候。",
  livePreview: "实时预览",
  retakingLabel: "正在重拍第 {n} 张",

  captureButton: "拍照",
  retakeButtonLabel: "重拍第 {n} 张",
  finishButton: "完成拍摄",

  photoStatusEyebrow: "Photo Status",
  shootingStatus: "拍摄状态",
  shotsCompleteLabel: "{shots} / {total} 张完成",
  cutLabel: "第 {n} 张",
  retakeLabel: "重拍",
  waitingLabel: "等待中",
  shotEmptyText: "照片将显示在这里。",

  resultInitializing: "正在准备结果...",
  resultNoShots: "未找到照片数据。请返回摄像头页面拍摄 4 张照片。",
  resultMobileHint: "在移动端刷新页面可能会清除会话数据，请在拍摄后立即保存。",
  goToCamera: "前往摄像头",
  rendering: "合成中...",
  frameTab: "边框",
  filterTab: "滤镜",
  downloadPng: "下载 PNG",
  downloadJpg: "下载 JPG",
  reshoot: "重新拍摄",
  renderError: "图片合成失败。",
  downloadError: "下载失败，请重试。",

  cameraNotSupported: "您的浏览器不支持摄像头功能。请使用 Chrome、Safari 或 Edge 浏览器。",
  cameraPermissionDenied: "摄像头访问被拒绝。请在浏览器设置中允许摄像头访问。",
  cameraNotFound: "未找到摄像头。请确认已连接摄像头设备。",
  cameraBusy: "摄像头可能正被其他应用占用。请关闭其他摄像头应用后重试。",
  cameraOverconstrained: "此设备不支持当前摄像头设置。请刷新页面后重试。",
  cameraSecurity: "安全设置阻止了摄像头访问。请通过 HTTPS 或 localhost 访问。",
  cameraGeneric: "摄像头不可用。请刷新页面或尝试其他浏览器。",
  cameraPreviewMissing: "找不到摄像头预览元素。",
  cameraVideoLoading: "摄像头仍在加载中，请稍候。",
  captureNotReady: "摄像头未就绪，请稍候重试。",
};

// ─── Indonesian ───────────────────────────────────────────────────────────────

const id: Translations = {
  filterNames: { none: "Tidak ada", bw: "Hitam putih", sepia: "Sepia", warm: "Hangat", vivid: "Cerah", bright: "Terang", cool: "Dingin", vintage: "Vintage" },
  heroTitle: "Abadikan harimu.",
  heroDesc: "Tanpa instal aplikasi — foto langsung dari browser, pilih bingkai, dan unduh.",
  startButton: "Mulai",
  chipCamera: "Kamera mobile & PC",
  chipDownload: "Unduh PNG / JPG",
  chipFrames: "Berbagai bingkai",
  chipDecorate: "Dekorasi stiker",

  cameraInitializing: "Mempersiapkan kamera...",
  cameraLoading: "Menyiapkan kamera. Harap tunggu sebentar.",
  livePreview: "Pratinjau Langsung",
  retakingLabel: "Mengulang Foto {n}",

  captureButton: "Ambil Foto",
  retakeButtonLabel: "Ulangi Foto {n}",
  finishButton: "Selesai",

  photoStatusEyebrow: "Photo Status",
  shootingStatus: "Status Foto",
  shotsCompleteLabel: "{shots} / {total} foto selesai",
  cutLabel: "Foto {n}",
  retakeLabel: "Ulangi",
  waitingLabel: "Menunggu",
  shotEmptyText: "Foto Anda akan muncul di sini.",

  resultInitializing: "Mempersiapkan hasil...",
  resultNoShots: "Foto tidak ditemukan. Silakan kembali ke kamera dan ambil 4 foto.",
  resultMobileHint: "Di perangkat mobile, memuat ulang halaman dapat menghapus data sesi. Simpan foto segera setelah mengambilnya.",
  goToCamera: "Buka Kamera",
  rendering: "Memproses...",
  frameTab: "Bingkai",
  filterTab: "Filter",
  downloadPng: "Unduh PNG",
  downloadJpg: "Unduh JPG",
  reshoot: "Foto Ulang",
  renderError: "Gagal memproses gambar.",
  downloadError: "Unduhan gagal. Silakan coba lagi.",

  cameraNotSupported: "Browser Anda tidak mendukung akses kamera. Gunakan Chrome, Safari, atau Edge.",
  cameraPermissionDenied: "Akses kamera ditolak. Izinkan akses kamera di pengaturan browser Anda.",
  cameraNotFound: "Kamera tidak ditemukan. Pastikan kamera terhubung.",
  cameraBusy: "Kamera mungkin sedang digunakan aplikasi lain. Tutup aplikasi kamera lain dan coba lagi.",
  cameraOverconstrained: "Pengaturan kamera tidak didukung di perangkat ini. Muat ulang dan coba lagi.",
  cameraSecurity: "Akses kamera diblokir oleh pengaturan keamanan. Gunakan HTTPS atau localhost.",
  cameraGeneric: "Kamera tidak tersedia. Muat ulang halaman atau coba browser lain.",
  cameraPreviewMissing: "Elemen pratinjau kamera tidak ditemukan.",
  cameraVideoLoading: "Kamera masih memuat. Harap tunggu dan coba lagi.",
  captureNotReady: "Kamera belum siap. Harap tunggu sebentar.",
};

// ─── Spanish ──────────────────────────────────────────────────────────────────

const es: Translations = {
  filterNames: { none: "Sin filtro", bw: "B/N", sepia: "Sepia", warm: "Cálido", vivid: "Vívido", bright: "Brillante", cool: "Frío", vintage: "Vintage" },
  heroTitle: "Captura tu hoy.",
  heroDesc: "Sin instalar nada — toma fotos desde el navegador, elige un marco y descárgalas.",
  startButton: "Comenzar",
  chipCamera: "Cámara móvil y PC",
  chipDownload: "Descarga PNG / JPG",
  chipFrames: "Múltiples marcos",
  chipDecorate: "Decoración con stickers",

  cameraInitializing: "Preparando la cámara...",
  cameraLoading: "Iniciando la cámara. Por favor espera.",
  livePreview: "Vista previa en vivo",
  retakingLabel: "Repitiendo foto {n}",

  captureButton: "Tomar foto",
  retakeButtonLabel: "Repetir foto {n}",
  finishButton: "Terminar",

  photoStatusEyebrow: "Photo Status",
  shootingStatus: "Estado de fotos",
  shotsCompleteLabel: "{shots} / {total} fotos listas",
  cutLabel: "Foto {n}",
  retakeLabel: "Repetir",
  waitingLabel: "Esperando",
  shotEmptyText: "Tu foto aparecerá aquí.",

  resultInitializing: "Preparando resultado...",
  resultNoShots: "No se encontraron fotos. Vuelve a la cámara y toma las 4 fotos.",
  resultMobileHint: "En móvil, recargar la página puede borrar los datos de sesión. Guarda tu foto inmediatamente después.",
  goToCamera: "Ir a la cámara",
  rendering: "Procesando...",
  frameTab: "Marco",
  filterTab: "Filtro",
  downloadPng: "Descargar PNG",
  downloadJpg: "Descargar JPG",
  reshoot: "Volver a tomar",
  renderError: "Error al procesar la imagen.",
  downloadError: "La descarga falló. Inténtalo de nuevo.",

  cameraNotSupported: "Tu navegador no admite el acceso a la cámara. Usa Chrome, Safari o Edge.",
  cameraPermissionDenied: "Se denegó el acceso a la cámara. Permite el acceso en la configuración del navegador.",
  cameraNotFound: "No se encontró ninguna cámara. Verifica que haya una conectada.",
  cameraBusy: "La cámara puede estar en uso por otra app. Ciérrala e inténtalo de nuevo.",
  cameraOverconstrained: "La configuración de cámara no es compatible con este dispositivo. Recarga e inténtalo.",
  cameraSecurity: "El acceso a la cámara está bloqueado por seguridad. Usa HTTPS o localhost.",
  cameraGeneric: "Cámara no disponible. Recarga la página o prueba otro navegador.",
  cameraPreviewMissing: "No se encontró el elemento de vista previa de la cámara.",
  cameraVideoLoading: "La cámara aún se está cargando. Por favor espera.",
  captureNotReady: "La cámara no está lista. Espera un momento e inténtalo de nuevo.",
};

// ─── Arabic ───────────────────────────────────────────────────────────────────

const ar: Translations = {
  filterNames: { none: "بلا فلتر", bw: "أبيض وأسود", sepia: "سيبيا", warm: "دافئ", vivid: "زاهي", bright: "مضيء", cool: "بارد", vintage: "كلاسيكي" },
  heroTitle: "سجّل يومك.",
  heroDesc: "بدون تثبيت تطبيق — التقط الصور مباشرة من المتصفح، واختر إطارًا، ونزّل صورتك.",
  startButton: "ابدأ",
  chipCamera: "دعم كاميرا الجوال والكمبيوتر",
  chipDownload: "تنزيل PNG / JPG",
  chipFrames: "إطارات متنوعة",
  chipDecorate: "تزيين بالملصقات",

  cameraInitializing: "جارٍ تجهيز الكاميرا...",
  cameraLoading: "جارٍ تشغيل الكاميرا، يرجى الانتظار.",
  livePreview: "معاينة مباشرة",
  retakingLabel: "إعادة التقاط {n}",

  captureButton: "التقاط صورة",
  retakeButtonLabel: "إعادة التقاط {n}",
  finishButton: "إنهاء",

  photoStatusEyebrow: "Photo Status",
  shootingStatus: "حالة الصور",
  shotsCompleteLabel: "{shots} / {total} صور مكتملة",
  cutLabel: "صورة {n}",
  retakeLabel: "إعادة",
  waitingLabel: "انتظار",
  shotEmptyText: "ستظهر صورتك هنا.",

  resultInitializing: "جارٍ تجهيز النتيجة...",
  resultNoShots: "لم يتم العثور على صور. يرجى العودة إلى الكاميرا والتقاط 4 صور.",
  resultMobileHint: "على الجوال، قد يؤدي إعادة التحميل إلى مسح بيانات الجلسة. احفظ صورتك فور الالتقاط.",
  goToCamera: "الذهاب إلى الكاميرا",
  rendering: "جارٍ المعالجة...",
  frameTab: "إطار",
  filterTab: "فلتر",
  downloadPng: "تنزيل PNG",
  downloadJpg: "تنزيل JPG",
  reshoot: "إعادة التصوير",
  renderError: "فشل في معالجة الصورة.",
  downloadError: "فشل التنزيل. يرجى المحاولة مرة أخرى.",

  cameraNotSupported: "متصفحك لا يدعم الوصول إلى الكاميرا. يرجى استخدام Chrome أو Safari أو Edge.",
  cameraPermissionDenied: "تم رفض الوصول إلى الكاميرا. يرجى السماح بالوصول في إعدادات المتصفح.",
  cameraNotFound: "لم يتم العثور على كاميرا. تأكد من توصيل كاميرا.",
  cameraBusy: "قد تكون الكاميرا مستخدمة من تطبيق آخر. أغلق تطبيقات الكاميرا الأخرى وحاول مجددًا.",
  cameraOverconstrained: "إعدادات الكاميرا غير مدعومة على هذا الجهاز. أعد تحميل الصفحة وحاول مجددًا.",
  cameraSecurity: "تم حجب الوصول إلى الكاميرا بسبب إعدادات الأمان. يرجى استخدام HTTPS أو localhost.",
  cameraGeneric: "الكاميرا غير متاحة. أعد تحميل الصفحة أو جرّب متصفحًا آخر.",
  cameraPreviewMissing: "لم يتم العثور على عنصر معاينة الكاميرا.",
  cameraVideoLoading: "الكاميرا لا تزال تحمّل. يرجى الانتظار والمحاولة مجددًا.",
  captureNotReady: "الكاميرا ليست جاهزة. يرجى الانتظار لحظة وحاول مجددًا.",
};

// ─── French ───────────────────────────────────────────────────────────────────

const fr: Translations = {
  filterNames: { none: "Aucun", bw: "N&B", sepia: "Sépia", warm: "Chaud", vivid: "Vif", bright: "Lumineux", cool: "Froid", vintage: "Vintage" },
  heroTitle: "Capturez votre aujourd'hui.",
  heroDesc: "Sans installation — prenez des photos depuis le navigateur, choisissez un cadre et téléchargez.",
  startButton: "Commencer",
  chipCamera: "Caméra mobile & PC",
  chipDownload: "Téléchargement PNG / JPG",
  chipFrames: "Multiples cadres",
  chipDecorate: "Décoration avec stickers",

  cameraInitializing: "Préparation de la caméra...",
  cameraLoading: "Démarrage de la caméra. Veuillez patienter.",
  livePreview: "Aperçu en direct",
  retakingLabel: "Reprise de la photo {n}",

  captureButton: "Prendre une photo",
  retakeButtonLabel: "Reprendre la photo {n}",
  finishButton: "Terminer",

  photoStatusEyebrow: "Photo Status",
  shootingStatus: "Statut des photos",
  shotsCompleteLabel: "{shots} / {total} photos prises",
  cutLabel: "Photo {n}",
  retakeLabel: "Reprendre",
  waitingLabel: "En attente",
  shotEmptyText: "Votre photo apparaîtra ici.",

  resultInitializing: "Préparation du résultat...",
  resultNoShots: "Aucune photo trouvée. Retournez à la caméra et prenez les 4 photos.",
  resultMobileHint: "Sur mobile, actualiser la page peut effacer les données de session. Enregistrez votre photo immédiatement.",
  goToCamera: "Aller à la caméra",
  rendering: "Traitement en cours...",
  frameTab: "Cadre",
  filterTab: "Filtre",
  downloadPng: "Télécharger PNG",
  downloadJpg: "Télécharger JPG",
  reshoot: "Reprendre",
  renderError: "Erreur lors du traitement de l'image.",
  downloadError: "Échec du téléchargement. Veuillez réessayer.",

  cameraNotSupported: "Votre navigateur ne prend pas en charge l'accès à la caméra. Utilisez Chrome, Safari ou Edge.",
  cameraPermissionDenied: "L'accès à la caméra a été refusé. Veuillez autoriser l'accès dans les paramètres du navigateur.",
  cameraNotFound: "Aucune caméra trouvée. Vérifiez qu'une caméra est connectée.",
  cameraBusy: "La caméra est peut-être utilisée par une autre application. Fermez-la et réessayez.",
  cameraOverconstrained: "Les paramètres de la caméra ne sont pas pris en charge sur cet appareil. Actualisez et réessayez.",
  cameraSecurity: "L'accès à la caméra est bloqué par les paramètres de sécurité. Utilisez HTTPS ou localhost.",
  cameraGeneric: "Caméra non disponible. Actualisez la page ou essayez un autre navigateur.",
  cameraPreviewMissing: "Élément d'aperçu de la caméra introuvable.",
  cameraVideoLoading: "La caméra se charge encore. Veuillez patienter.",
  captureNotReady: "La caméra n'est pas prête. Attendez un moment et réessayez.",
};

// ─── Russian ──────────────────────────────────────────────────────────────────

const ru: Translations = {
  filterNames: { none: "Без фильтра", bw: "Ч/Б", sepia: "Сепия", warm: "Тёплый", vivid: "Яркий", bright: "Светлый", cool: "Холодный", vintage: "Винтаж" },
  heroTitle: "Запечатлейте ваш день.",
  heroDesc: "Без установки приложений — снимайте в браузере, выбирайте рамку и скачивайте фото.",
  startButton: "Начать",
  chipCamera: "Камера на мобильном и ПК",
  chipDownload: "Скачивание PNG / JPG",
  chipFrames: "Разнообразные рамки",
  chipDecorate: "Украшение стикерами",

  cameraInitializing: "Подготовка камеры...",
  cameraLoading: "Запуск камеры. Пожалуйста, подождите.",
  livePreview: "Прямой просмотр",
  retakingLabel: "Пересъёмка фото {n}",

  captureButton: "Сделать фото",
  retakeButtonLabel: "Переснять фото {n}",
  finishButton: "Завершить",

  photoStatusEyebrow: "Photo Status",
  shootingStatus: "Статус съёмки",
  shotsCompleteLabel: "{shots} / {total} снято",
  cutLabel: "Фото {n}",
  retakeLabel: "Переснять",
  waitingLabel: "Ожидание",
  shotEmptyText: "Здесь появится ваше фото.",

  resultInitializing: "Подготовка результата...",
  resultNoShots: "Фотографии не найдены. Вернитесь к камере и сделайте 4 снимка.",
  resultMobileHint: "На мобильных устройствах обновление страницы может удалить данные сеанса. Сохраните фото сразу после съёмки.",
  goToCamera: "Перейти к камере",
  rendering: "Обработка...",
  frameTab: "Рамка",
  filterTab: "Фильтр",
  downloadPng: "Скачать PNG",
  downloadJpg: "Скачать JPG",
  reshoot: "Снять заново",
  renderError: "Ошибка при обработке изображения.",
  downloadError: "Ошибка загрузки. Пожалуйста, попробуйте снова.",

  cameraNotSupported: "Ваш браузер не поддерживает доступ к камере. Используйте Chrome, Safari или Edge.",
  cameraPermissionDenied: "Доступ к камере запрещён. Разрешите доступ в настройках браузера.",
  cameraNotFound: "Камера не найдена. Убедитесь, что камера подключена.",
  cameraBusy: "Камера может использоваться другим приложением. Закройте другие приложения и попробуйте снова.",
  cameraOverconstrained: "Настройки камеры не поддерживаются на этом устройстве. Обновите страницу и повторите.",
  cameraSecurity: "Доступ к камере заблокирован настройками безопасности. Используйте HTTPS или localhost.",
  cameraGeneric: "Камера недоступна. Обновите страницу или попробуйте другой браузер.",
  cameraPreviewMissing: "Элемент предварительного просмотра камеры не найден.",
  cameraVideoLoading: "Камера ещё загружается. Пожалуйста, подождите.",
  captureNotReady: "Камера не готова. Подождите немного и попробуйте снова.",
};

// ─── Portuguese ───────────────────────────────────────────────────────────────

const pt: Translations = {
  filterNames: { none: "Sem filtro", bw: "P&B", sepia: "Sépia", warm: "Quente", vivid: "Vívido", bright: "Brilhante", cool: "Frio", vintage: "Vintage" },
  heroTitle: "Capture o seu hoje.",
  heroDesc: "Sem instalar nada — tire fotos no navegador, escolha um enquadramento e baixe.",
  startButton: "Começar",
  chipCamera: "Câmera mobile e PC",
  chipDownload: "Download PNG / JPG",
  chipFrames: "Múltiplas molduras",
  chipDecorate: "Decoração com adesivos",

  cameraInitializing: "Preparando a câmera...",
  cameraLoading: "Iniciando a câmera. Por favor, aguarde.",
  livePreview: "Visualização ao vivo",
  retakingLabel: "Repetindo foto {n}",

  captureButton: "Tirar foto",
  retakeButtonLabel: "Repetir foto {n}",
  finishButton: "Concluir",

  photoStatusEyebrow: "Photo Status",
  shootingStatus: "Status das fotos",
  shotsCompleteLabel: "{shots} / {total} fotos prontas",
  cutLabel: "Foto {n}",
  retakeLabel: "Repetir",
  waitingLabel: "Aguardando",
  shotEmptyText: "Sua foto aparecerá aqui.",

  resultInitializing: "Preparando resultado...",
  resultNoShots: "Nenhuma foto encontrada. Volte à câmera e tire as 4 fotos.",
  resultMobileHint: "No celular, recarregar a página pode apagar os dados da sessão. Salve sua foto logo após tirá-la.",
  goToCamera: "Ir para câmera",
  rendering: "Processando...",
  frameTab: "Moldura",
  filterTab: "Filtro",
  downloadPng: "Baixar PNG",
  downloadJpg: "Baixar JPG",
  reshoot: "Refazer fotos",
  renderError: "Falha ao processar a imagem.",
  downloadError: "Download falhou. Tente novamente.",

  cameraNotSupported: "Seu navegador não suporta acesso à câmera. Use Chrome, Safari ou Edge.",
  cameraPermissionDenied: "Acesso à câmera negado. Permita o acesso nas configurações do navegador.",
  cameraNotFound: "Nenhuma câmera encontrada. Verifique se há uma câmera conectada.",
  cameraBusy: "A câmera pode estar em uso por outro aplicativo. Feche outros apps e tente novamente.",
  cameraOverconstrained: "As configurações de câmera não são suportadas neste dispositivo. Recarregue e tente novamente.",
  cameraSecurity: "Acesso à câmera bloqueado pelas configurações de segurança. Use HTTPS ou localhost.",
  cameraGeneric: "Câmera indisponível. Recarregue a página ou tente outro navegador.",
  cameraPreviewMissing: "Elemento de visualização da câmera não encontrado.",
  cameraVideoLoading: "A câmera ainda está carregando. Aguarde e tente novamente.",
  captureNotReady: "A câmera não está pronta. Aguarde um momento e tente novamente.",
};

// ─── German ───────────────────────────────────────────────────────────────────

const de: Translations = {
  filterNames: { none: "Kein Filter", bw: "S/W", sepia: "Sepia", warm: "Warm", vivid: "Lebendig", bright: "Hell", cool: "Kühl", vintage: "Vintage" },
  heroTitle: "Halte deinen heutigen Tag fest.",
  heroDesc: "Ohne App-Installation — fotografiere im Browser, wähle einen Rahmen und lade dein Bild herunter.",
  startButton: "Loslegen",
  chipCamera: "Kamera für Mobil & PC",
  chipDownload: "PNG / JPG herunterladen",
  chipFrames: "Verschiedene Rahmen",
  chipDecorate: "Mit Stickern dekorieren",

  cameraInitializing: "Kamera wird vorbereitet...",
  cameraLoading: "Kamera wird gestartet. Bitte warten.",
  livePreview: "Live-Vorschau",
  retakingLabel: "Foto {n} wird wiederholt",

  captureButton: "Foto aufnehmen",
  retakeButtonLabel: "Foto {n} wiederholen",
  finishButton: "Fertigstellen",

  photoStatusEyebrow: "Photo Status",
  shootingStatus: "Aufnahmestatus",
  shotsCompleteLabel: "{shots} / {total} Fotos fertig",
  cutLabel: "Foto {n}",
  retakeLabel: "Wiederholen",
  waitingLabel: "Warten",
  shotEmptyText: "Ihr Foto erscheint hier.",

  resultInitializing: "Ergebnis wird vorbereitet...",
  resultNoShots: "Keine Fotos gefunden. Gehen Sie zur Kamera zurück und machen Sie 4 Fotos.",
  resultMobileHint: "Auf Mobilgeräten kann das Neuladen die Sitzungsdaten löschen. Speichern Sie Ihr Foto sofort nach der Aufnahme.",
  goToCamera: "Zur Kamera",
  rendering: "Wird verarbeitet...",
  frameTab: "Rahmen",
  filterTab: "Filter",
  downloadPng: "PNG herunterladen",
  downloadJpg: "JPG herunterladen",
  reshoot: "Neu aufnehmen",
  renderError: "Fehler beim Verarbeiten des Bildes.",
  downloadError: "Download fehlgeschlagen. Bitte erneut versuchen.",

  cameraNotSupported: "Ihr Browser unterstützt keinen Kamerazugriff. Bitte Chrome, Safari oder Edge verwenden.",
  cameraPermissionDenied: "Kamerazugriff verweigert. Bitte erlauben Sie den Zugriff in den Browser-Einstellungen.",
  cameraNotFound: "Keine Kamera gefunden. Bitte überprüfen Sie, ob eine Kamera angeschlossen ist.",
  cameraBusy: "Die Kamera wird möglicherweise von einer anderen App verwendet. Schließen Sie diese und versuchen Sie es erneut.",
  cameraOverconstrained: "Die Kameraeinstellungen werden auf diesem Gerät nicht unterstützt. Laden Sie die Seite neu.",
  cameraSecurity: "Kamerazugriff durch Sicherheitseinstellungen gesperrt. Bitte HTTPS oder localhost verwenden.",
  cameraGeneric: "Kamera nicht verfügbar. Laden Sie die Seite neu oder versuchen Sie einen anderen Browser.",
  cameraPreviewMissing: "Kamera-Vorschau-Element nicht gefunden.",
  cameraVideoLoading: "Die Kamera wird noch geladen. Bitte warten.",
  captureNotReady: "Die Kamera ist noch nicht bereit. Bitte warten Sie einen Moment.",
};

// ─── Export ───────────────────────────────────────────────────────────────────

export function getTranslations(locale: string): Translations {
  if (locale === "en") return en;
  if (locale === "ja") return ja;
  if (locale === "zh") return zh;
  if (locale === "id") return id;
  if (locale === "es") return es;
  if (locale === "ar") return ar;
  if (locale === "fr") return fr;
  if (locale === "ru") return ru;
  if (locale === "pt") return pt;
  if (locale === "de") return de;
  return ko;
}
