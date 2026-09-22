# Exa 프로덕션 대비 verification {#verification-against-exa-production}

프로덕션 snapshot: 2026년 9월 18일. 로컬 미리보기: http://localhost:3000/docs.

| Check                 | 결과                                                          | Evidence                              |
| --------------------- | ----------------------------------------------------------- | ------------------------------------- |
| 소스 목록 및 내비게이션         | 159개 페이지 중 159개; 누락되거나 추가된 페이지 없음                           | [콘텐츠 감사](content-audit.json)          |
| HTTP 페이지 렌더링          | 159개 경로 중 159개 렌더링                                          | [경로 감사](route-audit.json)             |
| 렌더링된 전체 API 콘텐츠       | 공백 정규화 후 69개 중 69개가 프로덕션과 일치                                | [API 비교](api-content-audit.json)      |
| 내부 링크 및 API reference | 작성된 링크 378개와 69개 schema 경로/메서드 전부 통과                        | [콘텐츠 감사](content-audit.json)          |
| 게시된 다운로드              | 테스트한 Markdown, LLM, schema export 9개 모두 일치하는 payload로 정상 응답 | [Export 감사](exports-report.json)      |
| 인터랙션 동작               | 브라우저 check 11개 모두 통과, 페이지 오류 없음                             | [인터랙션 감사](interaction-audit.json)     |
| 데스크톱 레이아웃             | 159개 경로 모두 측정된 형상 및 전체 콘텐츠 높이와 일치; 런타임 오류나 깨진 이미지 없음        | [시각 요약](visual-summary.json)          |
| 모바일 및 다크 모드           | 대표 경로 5개에 걸쳐 10건 비교; 측정된 레이아웃 일치, 가로 오버플로나 깨진 이미지 없음        | [모바일/테마 비교](mobile-theme/report.json) |
| Mintlify 빌드 및 링크      | `pnpm validate`와 `pnpm check:links` 통과                      | 아래 재현 가능한 명령어 참고                      |

인터랙션 check에는 홈페이지의 모든 예시 셀렉터, 로컬 전문 search 및 키보드 내비게이션, 빈 결과,
Escape, 클립보드 복사, 테마 전환, API schema 렌더링, Agent spreadsheet 탭 7개 전체,
모바일 내비게이션/search가 포함됩니다.

## 블라인드 시각 검토 {#blind-visual-review}

[159페이지 분량의 A/B 비교 갤러리 열기](blind/index.html). 각 페이지의 두 스크린샷은
서로 독립적으로 섞입니다. 갤러리는 A/B/무승부 선호도를 브라우저에 저장합니다.
대표적인 데스크톱/모바일 쌍 4개도 식별 키를 참조하지 않고 검토했습니다:
[최종 검토](blind/final-review.md).
이전에 진행한 독립 검토와 해당 스크린샷은 `blind/review-round-2/`에 보관되어 있습니다.

최종 대표 검토 결과, 어느 쪽 버전에도 의미 있는 미적 우위는 없었습니다.
최종 대표 쌍 중 둘은 비트맵이 완전히 동일하며, 나머지 둘은 기록된 임계값 기준으로 각각 8픽셀과
1픽셀만 차이가 납니다
([픽셀 측정값](representative-pixel-comparison.json)). 이는 캡처된 뷰포트에 대한
검사일 뿐, 모든 픽셀이 동일하다거나 호스팅 서비스가 동등하다는 주장은 아닙니다.
159개 페이지 전체에서 본문 텍스트는 158개가 일치하며, 나머지 한 건의 차이는
실시간 상태 페이지의 검사 timestamp입니다.

## 충실도 세부 사항 {#fidelity-details}

import는 프로덕션 테마, 내비게이션, 커스텀 스타일과 스크립트, 폰트, 페이지
metadata, API 명세, 원본 MDX 컴포넌트를 그대로 보존합니다. 또한 Markdown
export에서 누락된 Agent Examples spreadsheet와 로컬 렌더러가 빠뜨린 게시된 수정
라벨 85개도 복원합니다. 원본 response와 체크섬은 `source-snapshot/`에 보관됩니다.

Exa의 호스팅 AI 어시스턴트는 Mintlify 로컬 미리보기에서 사용할 수 없습니다. 로컬
컨트롤을 누르면 대신 동작하는 문서 search가 열립니다. 외부 dashboard와 API
플레이그라운드로 연결되는 링크는 외부 그대로 유지됩니다. Markdown 및 schema
다운로드 URL은 동일한 `.txt` payload로 리다이렉트되는데, 네이티브 개발 서버가
해당 파일 확장자를 직접 제공하지 않기 때문입니다. 실시간 상태 timestamp와
애니메이션 미디어는 캡처 시점에 따라 다를 수 있습니다.

## 재현하기 {#reproduce}

```sh
pnpm validate
pnpm check:links
pnpm audit:content
pnpm dev
# 미리보기를 실행한 상태로 다른 터미널에서:
python3 verification/audit-content.py --url http://localhost:3000 --output verification/route-audit.json
python3 verification/check-exports.py
node verification/audit-interactions.mjs
node verification/audit-api-content.mjs
node verification/compare-all.mjs
node verification/mobile-theme-check.mjs
node verification/build-blind-gallery.mjs
```

브라우저 검사에는 Google Chrome이 필요하며, 설치된 Playwright 패키지를 사용합니다.
전체 페이지 스크린샷은 로컬에서 생성되는 아티팩트로 Git에서 제외됩니다.
새로 체크아웃한 환경에서 갤러리를 사용하려면 먼저 스크린샷을 다시 생성하세요.