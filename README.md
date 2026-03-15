# Pic Moment

Next.js App Router 기반의 "인생 4컷" 스타일 웹 서비스입니다. 브라우저 카메라를 통해 4장을 촬영하고, Canvas API로 세로형 4컷 이미지를 합성한 뒤 로컬에 다운로드할 수 있습니다.

## 폴더 구조

```text
pic-moment/
├─ app/
│  ├─ camera/
│  │  ├─ camera.module.css
│  │  └─ page.tsx
│  ├─ result/
│  │  ├─ result.module.css
│  │  └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.module.css
│  └─ page.tsx
├─ components/
│  ├─ CameraCapture.module.css
│  ├─ CameraCapture.tsx
│  ├─ FourCutPreview.module.css
│  └─ FourCutPreview.tsx
├─ lib/
│  ├─ camera.ts
│  └─ canvas.ts
├─ .dockerignore
├─ .eslintrc.json
├─ .gitignore
├─ Dockerfile
├─ next.config.ts
├─ next-env.d.ts
├─ package.json
├─ public/
│  └─ .gitkeep
├─ README.md
└─ tsconfig.json
```

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 으로 접속합니다.

## 빌드 및 실행

```bash
npm run build
npm run start
```

## Docker 개발 실행

```bash
docker compose -f docker-compose.dev.yml up --build
```

- 브라우저에서 `http://localhost:3000` 으로 접속합니다.
- 소스 코드는 로컬 폴더를 컨테이너에 마운트하므로 수정 사항이 개발 서버에 반영됩니다.
- Windows 환경의 파일 변경 감지를 위해 polling 옵션을 활성화했습니다.

## AWS 배포 개요

- `next.config.ts` 에 `output: "standalone"` 를 설정해 컨테이너 배포에 적합하게 구성했습니다.
- `Dockerfile` 을 사용하면 AWS App Runner, ECS Fargate, Elastic Beanstalk(도커 기반)로 바로 확장할 수 있습니다.
- 정적 자산은 CloudFront + S3, 앱 서버는 ALB 뒤 ECS/App Runner 조합으로 분리할 수 있습니다.
- HTTPS 종료, 캐시 정책, 로그 수집은 배포 환경에서 별도로 설정하는 것을 권장합니다.
