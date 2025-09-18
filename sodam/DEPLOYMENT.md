# GitHub Pages 배포 가이드

## 🚀 배포 설정

### 1. GitHub 저장소 설정

1. GitHub 저장소 → Settings → Pages
2. Source: "GitHub Actions" 선택
3. 저장

### 2. 환경 변수 설정

GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 시크릿 추가:

- `REACT_APP_KAKAO_MAP_API_KEY`: 카카오맵 API 키
- `REACT_APP_API_URL`: 백엔드 API URL

### 3. 자동 배포

- `main` 브랜치에 푸시할 때마다 자동으로 배포됩니다
- GitHub Actions 탭에서 배포 상태를 확인할 수 있습니다

## 📝 배포 URL

- **프로덕션**: https://combile.github.io/Sodam-Web
- **개발**: 로컬에서 `npm start` 실행

## 🔧 로컬 테스트

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 프로덕션 빌드 테스트
npm run build
npx serve -s build
```

## 🐛 문제 해결

- 배포 실패 시 GitHub Actions 로그 확인
- 환경 변수가 올바르게 설정되었는지 확인
- 카카오맵 API 키가 GitHub Pages 도메인에 허용되어 있는지 확인
