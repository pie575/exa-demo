<div id="verification-against-exa-production">
  # Exa 프로덕션 대비 검증
</div>

프로덕션 스냅샷: 2026년 9월 18일. 로컬 미리보기: http://localhost:3000/docs.

| 검사 항목            | 결과                                                        | 근거                                    |
| ---------------- | --------------------------------------------------------- | ------------------------------------- |
| 소스 인벤토리 및 내비게이션  | 159개 중 159개 페이지; 누락되거나 추가된 페이지 없음                         | [콘텐츠 감사](content-audit.json)          |
| HTTP 페이지 렌더링     | 159개 중 159개 라우트 렌더링                                       | [라우트 감사](route-audit.json)            |
| 렌더링된 전체 API 콘텐츠  | 공백 정규화 후 69개 중 69개가 프로덕션과 일치                              | [API 비교](api-content-audit.json)      |
| 내부 링크 및 API 참조   | 작성된 링크 378개와 69개 schema 경로/메서드 모두 통과                      | [콘텐츠 감사](content-audit.json)          |
| 게시된 다운로드         | 테스트한 Markdown, LLM, schema 내보내기 9개 모두 정상 확인되며 payload도 일치 | [내보내기 감사](exports-report.json)        |
| 인터랙티브 동작         | 브라우저 검사 11개 모두 통과, 페이지 오류 없음                              | [인터랙션 감사](interaction-audit.json)     |
| 데스크톱 레이아웃        | 159개 라우트 모두 측정된 형상 및 전체 콘텐츠 높이와 일치; 런타임 오류나 깨진 이미지 없음     | [시각적 요약](visual-summary.json)         |
| 모바일 및 다크 모드      | 대표 라우트 5개에 대한 비교 10건; 측정된 레이아웃 일치, 가로 오버플로나 깨진 이미지 없음     | [모바일/테마 비교](mobile-theme/report.json) |
| Mintlify 빌드 및 링크 | `pnpm validate` 및 `pnpm check:links` 통과                   | 아래 재현 가능한 명령어 참고                      |

인터랙션 검사에는 홈페이지의 모든 예제 선택기, 로컬 전문 search 및 키보드 내비게이션,
빈 결과, Escape, 클립보드 복사, 테마 전환, API schema 렌더링, Agent 스프레드시트 탭 7개 전체,
모바일 내비게이션/search가 포함됩니다.

<div id="blind-visual-review">
  ## 블라인드 시각 검토
</div>

[159페이지 분량의 A/B 비교 갤러리 열기](blind/index.html). 각 페이지의 두
스크린샷은 서로 독립적으로 섞여 있습니다. 갤러리는 A/B/무승부 선호도를
브라우저에 저장합니다. 대표적인 데스크톱/모바일 쌍 네 건은 식별 key를 참조하지
않고 검토했습니다: [최종 검토](blind/final-review.md).
앞서 진행한 독립 검토와 해당 스크린샷은 `blind/review-round-2/`에
보관되어 있습니다.

최종 대표 검토 결과, 두 버전 사이에 의미 있는 미적 우위는 발견되지
않았습니다. 최종 대표 쌍 중 두 건은 비트맵이 완전히 동일하며, 나머지 두 건은 기록된
임계값 기준으로 각각 8픽셀과 1픽셀만 차이가 납니다
([픽셀 측정값](representative-pixel-comparison.json)). 이는 캡처된 뷰포트에
한정된 확인일 뿐이며, 모든 픽셀이 동일하다거나 호스팅 서비스가 동등하다는
주장은 아닙니다. 159개 페이지 전체에서 본문 텍스트는 158개가 일치하며,
나머지 한 건의 차이는 실시간 상태 page의 확인 timestamp입니다.

<div id="fidelity-details">
  ## 충실도 세부 사항
</div>

이 import는 프로덕션 테마, 내비게이션, 사용자 정의 스타일 및 스크립트, 폰트,
페이지 메타데이터, API 명세, 원본 MDX 컴포넌트를 그대로 유지합니다.
또한 Markdown 내보내기에서 빠진 Agent Examples 스프레드시트와 로컬 렌더러가
누락한 85개의 게시된 수정 라벨도 복원합니다.
원본 응답과 체크섬은 `source-snapshot/`에 보존됩니다.

Exa가 호스팅하는 AI 어시스턴트는 Mintlify 로컬 미리보기에서는 사용할 수 없습니다.
로컬에서 해당 컨트롤을 누르면 대신 정상 동작하는 문서 search가 열립니다. 외부
dashboard와 API 플레이그라운드 링크는 외부 그대로 유지됩니다. 네이티브 개발
서버가 해당 파일 확장자를 직접 제공하지 않기 때문에 Markdown 및 schema 다운로드
URL은 내용이 동일한 `.txt` payload로 리디렉션됩니다. 실시간 상태 timestamp와
애니메이션 미디어는 캡처 시점에 따라 다를 수 있습니다.

<div id="reproduce">
  ## 재현하기
</div>

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

브라우저 검사에는 Google Chrome이 필요하며, 설치된 Playwright package를 사용합니다.
전체 페이지 스크린샷은 로컬에서 생성되는 아티팩트이며 Git에서 제외됩니다.
새로 체크아웃한 환경에서 갤러리를 사용하려면 먼저 스크린샷을 다시 생성하세요.