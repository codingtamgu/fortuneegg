# Fortune Egg Web

`Fortune Egg`는 소원을 적고 에그를 깨면 오늘의 포춘이 열리는 모바일 중심 웹 프로토타입입니다.

## Scripts

- `npm run dev`: 로컬 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run lint`: ESLint 검사
- `npm run preview`: 빌드 결과 미리보기

## Structure

- `src/App.tsx`: 전체 페이지 흐름
- `src/components/`: 인트로, 에그, 결과, 보상 모달 컴포넌트
- `src/data/fortunePool.ts`: 포춘 문구 풀
- `src/lib/fortune.ts`: 소원 기반 포춘 생성 로직
- `public/favicon.svg`: 황금 달걀 파비콘
- `src/assets/golden-egg-logo.svg`: 프로젝트 로고 자산

## Notes

- 진입 즉시 광고는 띄우지 않습니다.
- 첫 포춘은 무료로 보여주고, 추가 행동은 선택형으로 설계했습니다.
- 모바일 WebView 기준으로 확대/축소 제스처를 제한했습니다.
