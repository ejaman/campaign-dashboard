# AI 활용 내역

## 사용 도구

| 도구                            | 용도                                |
| ------------------------------- | ----------------------------------- |
| Claude Code (claude-sonnet-4-6) | 프로젝트 설계, 코드 작성, 코드 리뷰 |

---

## 1. 프로젝트 준비 단계

### CLAUDE.md 설계

**활용 방식**
Claude Code가 프로젝트 전반에서 일관된 코드를 생성하도록 CLAUDE.md에 다음 규칙을 주입했다.

- 기술 스택과 버전 (Next.js 16, React 19, Tailwind v4, pnpm 등)
- Layered + Feature 혼합형 폴더 구조와 각 디렉토리의 역할
- 개발 규칙 — 코드 작성(TypeScript 제약, 에러 핸들링) / 데이터 레이어(상태 분리 원칙) / 컴포넌트 레이어(렌더링 성능, UX) / 협업(커밋 컨벤션)
- 데이터 정규화 규칙과 파생 지표 계산 공식을 명시해 AI가 임의로 다른 방식으로 계산하지 않도록 고정

**직접 수정한 판단**

- 아직 설치 전인 라이브러리도 기술 스택에 명시 — Claude Code가 코드 생성 시 목표 스택 기준으로 작성하도록 유도하기 위해서

---

### 개발 규칙 통합

**활용 방식**
파편화된 규칙(절대 규칙, 컴포넌트 작성 원칙, 코딩 컨벤션 등 6개 섹션)을 플로우 순서로 통합하도록 요청했다.

**직접 수정한 판단**

- AI가 제안한 구조를 그대로 수용
- 단, "이미지 최적화(packages/ 폴더 예외)", "Core Web Vitals 90+", "CI/CD(Vercel, Supabase)", "TODO.md 워크플로우" 등 이 프로젝트와 무관한 내용 제거를 내가 직접 지시 — AI는 제거 여부를 판단하지 않고 나열했기 때문에, 프로젝트 맥락을 아는 내가 범위를 결정했다.

---

### TODO.md 구조화

**활용 방식**
요구사항 원문을 붙여넣고, feature 브랜치 단위로 체크리스트를 구조화하도록 요청했다.

**직접 수정한 판단**

- AI가 생성한 TODO에 평가 지표 표(배점 포함)를 직접 추가 — 개발 중 우선순위 판단에 참고하기 위해서

---

### 평가 지표 반영

**활용 방식**
과제 평가 항목(아키텍처 20점, 코드 품질 15점, AI 활용 20점 등)을 제시하고, CLAUDE.md 규칙에서 빠진 항목을 찾아 보완하도록 요청했다.

**AI가 추가한 내용**

- 에러 핸들링, 로딩 상태 규칙 (코드 품질 15점 대응)
- UX & 접근성, 반응형 규칙 (UX 10점 대응)
- AI 활용 문서화 섹션 (AI 활용 20점 대응)

---

## 2. 구현 단계 (진행 중 업데이트)

> 각 feature 구현 시 아래 항목을 추가한다.

### feat/setup

**활용 방식**

- 패키지 설치 목록(TanStack Query v5, Zustand, Recharts, react-hook-form, zod 등)과 각각의 역할을 제시하고, `package.json` 스크립트·`providers.tsx`·`QueryProvider` 초기 구성을 요청했다.
- `db.json` 스키마 설계 시 캠페인 raw 데이터에 불일치가 있을 수 있다는 조건을 미리 제시해, `RawCampaign` / `Campaign` 분리 타입 구조로 설계하도록 유도했다.

**직접 수정한 판단**

- **타입 분리 구조 요구**: AI가 단일 타입으로 설계했으나, API 응답 원본(`RawCampaign`)과 정규화된 도메인 타입(`Campaign`)을 명확히 분리하도록 직접 지시 — 데이터 정규화 단계를 명확히 하기 위해서
- **`db.json` 의도적 오염 추가**: 평가 항목(데이터 전처리)을 대비해 `"facebook"`, `"2000000원"`, `"2026/04/12"` 같은 비정형 데이터를 직접 추가 — AI는 정형 데이터만 생성했기 때문에, 정규화 로직이 실제로 동작하는지 검증할 수 없었음

### feat/filter

**활용 방식**

- Zustand `filterStore`로 초기 구현 후, URL query params 방식으로 전환하는 과정을 AI와 함께 진행했다.
- `useFilterParams` 훅 전체 설계(파싱, 직렬화, 전체 선택 생략 로직)를 요청했다.

**직접 수정한 판단**

- **Zustand → URL 전환 결정**: AI가 Zustand로 초기 구현했으나, URL 기반 상태 관리가 "공유 가능한 URL", "뒤로가기 동작", "새로고침 유지"를 보장한다는 이유로 전환을 직접 제안 — 기능 완성 후 구조를 다시 뒤집는 결정이었지만 평가 항목(상태관리 10점)과 UX 품질을 고려해 진행
- **전체 선택 = URL 파라미터 없음 패턴**: "전체 선택" 상태를 URL에 기록하지 않고 파라미터 부재로 표현하는 설계를 직접 제안 — AI 초안은 `platforms=Google,Meta,Naver`처럼 전체 값을 명시했으나, URL을 불필요하게 길게 만들고 초기값 변경 시 호환성이 없다는 문제를 직접 지적
- **`getDefaultDateRange` 함수 스코프 조정**: AI가 모듈 스코프에 상수로 정의해 서버 빌드 시 날짜가 고정되는 버그를 직접 발견하고 함수 호출로 교체하도록 지시

### feat/chart-daily

**활용 방식**

- 일별 추이 차트 전체 구조(훅, 컴포넌트, 필터 연동)를 설계·구현하도록 요청했다.

**직접 수정한 판단**

- `METRIC_COLORS` 색상 교체 — AI가 제안한 팔레트(`#6366f1`, `#f59e0b` 등)를 프로젝트 디자인에 맞는 색상(`#0081cf`, `#008f7a` 등)으로 직접 변경
- `animationDuration` 300ms → 700ms 조정 — AI가 제안한 300ms가 너무 빠르게 느껴져 자연스러운 속도로 직접 조율
- `isAnimationActive={false}` 부분 롤백 — AI가 두 Line 모두에 적용했으나, 원인 분석이 다를 수 있다고 판단해 직접 주석 처리 후 재현 조건을 좁혀 디버깅

**공통 컴포넌트로 만든 판단**

- `ChartShell` — 로딩/에러 상태 처리를 매 차트마다 반복하지 않도록, Suspense + ErrorBoundary를 감싼 공통 래퍼로 추출할 것을 직접 제안. 이후 추가될 차트(플랫폼별, 랭킹)도 동일 패턴으로 재사용 가능
- `Button` (ui/) — 필터 토글, 메트릭 토글 등 여러 곳에서 쓰이는 버튼을 도메인 무관한 범용 컴포넌트로 분리해 재사용
- `MetricToggle` — 일별 차트 전용으로 만들어진 AI 결과물을 `options` prop을 추가해 다른 차트에서도 재사용 가능한 범용 컴포넌트로 직접 요청해 확장

**그래프 디버깅**

- 클릭수만 활성화될 때 그래프가 반만 보이는 현상을 직접 발견. AI가 조건부 렌더링(`&&`)을 원인으로 지목했으나 재현 조건(두 지표 동시 활성 → 하나 비활성화)을 직접 좁혀 YAxis 도메인 재계산 애니메이션이 원인임을 확인
- 필터 변경 시에도 동일 현상 발생함을 직접 발견해 Recharts의 구조적 한계(데이터 변경 시 entrance 애니메이션 재실행)로 원인을 확정

### feat/chart-daily — PR 피드백 반영

**계기**
Gemini Code Assist PR 리뷰에서 `METRIC_LABELS`, `METRIC_COLORS`가 별도 Record로 분리되어 있고, `ChartMetric` 타입까지 3곳에 분산된 점을 지적받았다. 이를 계기로 단순 수정이 아닌 구조 개선을 직접 제안했다.

**직접 제안한 개선: CHART_METRICS 튜플로 통합**

```ts
export const CHART_METRICS = [
  { key: 'impressions', label: '노출수', color: '#0081cf' },
  ...
] as const

export type ChartMetric = (typeof CHART_METRICS)[number]['key']
```

**장점**

- **단일 진실 공급원**: 지표 추가 시 배열 한 곳만 수정하면 타입·레이블·색상이 자동 반영
- **타입 자동 파생**: `as const` + `typeof`로 타입을 데이터에서 추론해 타입과 데이터 불일치 원천 차단
- **순서 보장**: 배열이므로 렌더링 순서가 선언 순서를 따름 (Record는 순서 보장 없음)

### feat/table

**활용 방식**

- 캠페인 목록 테이블 전체(훅, 컴포넌트 분리, 정렬·검색·페이지네이션·체크박스·일괄 상태 변경)를 설계·구현하도록 요청했다.
- `SearchInput` UI 컴포넌트, `useBulkStatusUpdate` 훅, `useCampaignRegisterModal` Zustand 훅 등 재사용 가능한 단위를 개별 요청으로 추출했다.

**직접 수정한 판단**

- **컴포넌트 뎁스 조정**: AI가 `CampaignTableContainer` 중간 레이어를 추가했으나, "너무 뎁스가 깊다"고 판단해 삭제를 직접 지시. `CampaignTableMeta` + `CampaignTableContent`를 `AsyncBoundary` 안에 형제로 배치하는 구조로 변경 — TanStack Query 캐시 덕분에 두 컴포넌트가 동일 쿼리를 각각 호출해도 네트워크 중복 없음을 확인 후 결정
- **검색 방식 3회 수정**: 실시간 → 버튼 클릭 → 실시간 순으로 변경. 최종적으로 `useTransition`을 적용해 입력 반응성은 유지하면서 테이블 업데이트를 낮은 우선순위로 처리하는 방식 채택 — AI 결과물을 그대로 수용하지 않고 UX 관점에서 반복 검토
- **컬럼 고정 너비**: 검색 결과 변화에 따라 테이블 레이아웃이 흔들리는 문제를 직접 발견. `table-fixed` + 퍼센트 너비 방식으로 수정하도록 직접 지시 (AI 초안에는 없던 개선)
- **`shared/` 레이어 도입**: `AsyncBoundary`를 `shared/` 디렉토리로 분리하는 구조를 직접 제안. 단일 feature에서만 쓰이는 컴포넌트를 `shared/`에 넣는 게 맞는지 AI에게 되묻고, "여러 feature에서 재사용되는 UI 조립 틀"로 기준을 직접 정의해 CLAUDE.md에 반영

**useEffect 대신 렌더 중 비교 패턴**

- 글로벌 필터 변경 시 페이지·선택 초기화에 `useEffect` + `setState`를 사용했더니 ESLint가 cascading render 경고를 발생시켰다. AI가 `prevFilterKey` 상태 비교를 렌더 중에 수행하는 React 권장 패턴(getDerivedState 유사)으로 수정했고, 이 방식이 effect보다 re-render 횟수가 적다는 원리를 직접 확인 후 채택했다.

### feat/campaign-modal

**활용 방식**

- 캠페인 등록 모달 전체(Modal 컴파운드 컴포넌트, react-hook-form + Zod 유효성 검증, queryClient.setQueryData로 캐시 직접 추가)를 설계·구현하도록 요청했다.

**직접 수정한 판단**

- **컴파운드 컴포넌트 패턴 요구**: AI 초안이 단순 prop-drilling 방식이었으나, CLAUDE.md에 선언한 컴파운드 컴포넌트 패턴(`Modal.Header` / `Modal.Content` / `Modal.Footer`)으로 재작성하도록 직접 지시
- **Zod v4 타입 오류 수정**: `z.coerce.number()`를 사용하면 react-hook-form resolver에서 `budget: unknown` 타입 오류가 발생. AI가 원인을 `z.number()` + `valueAsNumber: true` 조합으로 분석하고 수정 — Zod v4의 `coerce`가 타입을 `unknown`으로 추론하는 구조적 문제를 이 과정에서 파악
- **`watch()` → `useWatch()` 교체**: React Compiler가 `watch()`의 반환 함수를 메모이제이션할 수 없다고 경고. `useWatch({ control, name })` 방식으로 교체하도록 직접 지시 — 코드 실행 결과를 보고 직접 발견한 문제
- **FormItem 아키텍처 제안**: AI가 `FormField` / `FormSelect` / `FormDateField` 개별 wrapper를 만들었으나, 폼 필드가 늘어날수록 wrapper도 늘어나는 구조적 비효율을 직접 지적. label+error+suffix를 하나의 `FormItem`이 담당하고 `React.cloneElement`로 자식 input에 `id`를 주입하는 방식으로 재설계하도록 제안했다. 이를 통해 `Input`, `Select`, `DateInput` 각각을 도메인 무관한 독립 컴포넌트로 유지하면서 label-input 접근성 연결을 `FormItem`이 일관되게 처리

**CLAUDE.md 규칙 추가**

- AI가 작성한 코드에서 나온 접근성 오류(`htmlFor` 미연결, `aria-label` 중복)와 설계 결정(Controller 패턴, defaultValues 위치) 등을 AI_USAGE 작성과 병행해 CLAUDE.md에 즉시 반영 — 이후 세션에서 동일 실수 반복 방지

---

## 3. AI 활용 시 반복된 패턴

- **계획 먼저 확인**: 코드 생성 전 항상 변경 계획을 텍스트로 받고 확인 후 실행
- **범위 제한**: 요청 범위를 명확히 지정해 불필요한 리팩토링 방지
- **맥락 파일 활용**: CLAUDE.md를 통해 매 세션마다 프로젝트 규칙을 AI에게 주입, 일관된 코드 생성 유도

---

## 4. 개발 워크플로우

feature 단위 개발 시 아래 흐름을 반복했다.

1. **TODO 기준 구현 계획 수립**
   AI가 현재 브랜치의 TODO 항목을 읽고, 필요한 파일·컴포넌트·데이터 흐름을 텍스트 계획으로 먼저 제시한다.

2. **계획 검토 후 진행 승인**
   제시된 계획을 직접 검토하고 방향이 맞으면 구현을 승인한다. 불필요한 추상화나 범위 초과 여부를 이 단계에서 걸러낸다.

3. **TODO 항목 단위 커밋**
   구현 완료 후 TODO의 체크리스트 항목 하나하나를 기준으로 커밋을 나눠 남긴다. 커밋 전 메시지를 확인하고 최종 승인한다.

4. **PR 코드 리뷰 및 피드백 반영**
   PR을 열면 AI(Gemini Code Assist)가 자동으로 코드 리뷰를 진행한다. 리뷰 결과를 직접 읽고 아래 기준으로 선별해 반영한다.
   - **AI 추천 우선순위** — 리뷰어가 medium/high로 표시한 항목 우선 검토
   - **팀 컨벤션 부합 여부** — CLAUDE.md에 정의된 규칙과 일치하는 피드백만 반영
   - **가독성 저하 항목 선처리** — 코드 품질·가독성 관련 피드백은 기능 피드백보다 먼저 처리
