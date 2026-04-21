# 광고 캠페인 성과 대시보드 과제

본 과제는 차트, 테이블 등 다양한 위젯을 조합하여 마케팅 캠페인 성과 대시보드를 구현하는 과제입니다.

---

## 1. 실행 방법

### 요구 사항

- Node.js 20+
- pnpm 9+

### 로컬 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (Next.js + Turbopack)
pnpm dev
```

실행 후 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속
또는 https://campaign-dashboard-wheat.vercel.app 로 확인 가능합니다.

> Next.js API Routes(app/api/)를 활용하여 별도의 json-server 실행 없이 pnpm dev만으로 데이터 서빙이 가능하도록 통합했습니다.

### 주요 스크립트

| 명령어            | 설명                       |
| ----------------- | -------------------------- |
| `pnpm dev`        | 개발 서버 실행 (Turbopack) |
| `pnpm build`      | 프로덕션 빌드              |
| `pnpm start`      | 프로덕션 서버 실행         |
| `pnpm lint`       | ESLint 실행                |
| `pnpm format`     | Prettier 포맷              |
| `pnpm type-check` | TypeScript 타입 검사       |

---

## 2. 기술 스택 선택

| 역할            | 선택                                            |
| --------------- | ----------------------------------------------- |
| Framework       | Next.js 16 (App Router)                         |
| 서버 상태       | TanStack Query v5                               |
| 클라이언트 상태 | URL QueryParams(+ Zustand)                      |
| 차트            | Recharts                                        |
| 폼 검증         | react-hook-form + zod                           |
| API 서버        | Next.js API Routes (json-server → 마이그레이션) |

### Framework: Next.js 16 (App Router)

💡 선택 이유
: 서버 컴포넌트를 활용해 클라이언트 번들 크기를 획기적으로 줄이고, 대시보드 초기 로딩 속도를 최적화할 수 있습니다.

🤝 트레이드오프

`'use client'` 경계를 잘못 설정하면 서버 컴포넌트의 이점을 잃습니다. 따라서 서버/클라이언트 경계 설정에 따른 아키텍처 설계 비용이 발생하며, 과도한 서버 사이드 렌더링은 서버 부하를 높일 수 있습니다.

### 상태 관리(TanStack Query / URL Query Params)

#### 1. TanStack Query v5

💡 선택 이유

- 서버 상태를 전역에서 캐싱, 공유 하기 때문에 네트워크 요청 중복 제거 가능
- `useSuspenseQuery`를 통해 로딩, 에러 상태를 컴포넌트 밖(Suspense)에서 일괄 처리 가능 → 데이터 훅은 렌더링 로직만 담당
- `queryClient.setQueryData`로 캐시를 직접 갱신해 새로고침 없이 즉시 반영 가능

🤝 트레이드오프

전역 상태 라이브러리 외에 추가적인 라이브러리 도입으로 인한 번들 크기 증가, 러닝 커브가 존재합니다.

#### 2. URL Query Params + Zustand

💡 선택 이유

글로벌 필터는 다른 클라이언트 상태관리로도 여러 컴포넌트에서 공유할 수 있습니다.

- **새로고침 시 필터 유지**: Zustand 상태는 페이지를 새로고침하면 초기값으로 돌아감
- **URL 공유**: 특정 필터가 적용된 화면을 링크로 공유해도 수신자는 같은 필터 상태를 볼 수 없음
- **브라우저 뒤로가기로 이전 필터 복원**: 히스토리에 필터 상태가 기록되지 않아 뒤로가기가 동작하지 않음

대시보드에서 필터는 화면 전체에 영향을 미치는 핵심 상태이기 때문에, URL이 상태의 단일 진실 공급원이 되어야 한다고 판단했습니다.

모달 열림·닫힘처럼 URL 직렬화가 필요 없는 UI 상태에는 Zustand를 사용합니다.(낮은 러닝 커브 & 적은 보일러플레이트)

🤝 트레이드오프

필터를 자주 변경하면 뒤로가기 스택이 쌓입니다. 일반 변경은 `replace`로 히스토리를 덮어쓰고, 의미 있는 상태 전환(초기화)만 `push`로 남겨 스택 증가를 최소화했습니다.

### 차트: Recharts

💡 선택 이유

Recharts는 SVG 기반이면서 React 컴포넌트 API를 제공합니다. `<LineChart>`, `<PieChart>` 같은 차트 구성 요소를 선언적으로 조합할 수 있고, 툴팁·범례를 일반 React 컴포넌트로 교체할 수 있어 이 프로젝트의 커스텀 요구사항(플랫폼 필터 토글 범례 등)을 자연스럽게 처리할 수 있었습니다.

🤝 트레이드오프

라이브러리 전체를 가져오기 때문에 번들 크기가 큰 편입니다. 이를 보완하기 위해 랭킹 차트처럼 단순한 바 차트는 Recharts를 쓰지 않고 CSS로 직접 구현해 불필요한 의존성을 줄였습니다.

### 폼 검증: react-hook-form + Zod

💡 선택 이유

비제어 컴포넌트 방식을 활용해 폼 입력 시 발생하는 불필요한 리렌더링을 방지하고, 스키마 기반 유효성 검사로 타입 안정성을 확보합니다

🤝 트레이드오프

react-hook-form의 `register`는 네이티브 `<input>`의 `onChange(e: ChangeEvent)` 시그니처를 기대합니다. 그런데 `DateInput`처럼 값만 직접 넘기는 `onChange(value: string)` 시그니처의 커스텀 컴포넌트는 `register`로 연결할 수 없습니다. 이 경우 `Controller`로 감싸야 하는데, `Controller`는 `field.onChange`를 통해 react-hook-form이 기대하는 형식으로 값을 변환해 전달합니다. 커스텀 입력 컴포넌트를 설계할 때 이 차이를 사전에 인지해야 한다는 점이 트레이드오프입니다.

### API 서버: json-server → Next.js API Routes

💡 선택 이유 (→ Next.js API Routes)

개발 초기에는 `db.json` 하나로 REST API를 즉시 띄울 수 있는 json-server를 사용했습니다. 별도 서버 코드 없이 목 데이터를 HTTP로 서빙할 수 있어 프론트엔드 개발에 집중할 수 있었습니다.

- **불필요한 의존성 제거**
  : json-server는 `pnpm dev`와 별개로 실행해야 하는 독립 프로세스
  → Next.js API Routes로 전환하면 json-server 의존성을 제거하고 Next.js 기능만으로 동일한 역할을 구현 가능
- **단독 배포 가능**
  : json-server는 Vercel 배포 시 함께 올릴 수 없어 별도 호스팅이 필요
  → API Routes로 전환하면 `pnpm dev` 하나로 프론트엔드와 API가 함께 실행되고 Vercel에도 단독 배포 가능
- **TanStack Query와의 자연스러운 연결**
  : 클라이언트에서 TanStack Query로 데이터를 요청하는 구조, 데이터를 직접 `import`하지 않고 HTTP 요청으로 처리하는 것이 기존 흐름과 일관됨 (API Routes는 이 HTTP 요청을 받아 `db.json`을 `fs.readFile`로 읽어 응답하는 방식으로 동작)

🤝 트레이드오프

Next.js App Router는 `'use client'` 컴포넌트도 SSR 시점에 서버에서 렌더링합니다. TanStack Query의 `useSuspenseQuery`가 서버에서 실행될 때 `fetch('/api/campaigns')` 같은 상대 URL은 Node.js 환경에서 해석할 수 없어 절대 URL이 필요합니다. 실행 환경(브라우저/로컬/Vercel)에 따라 베이스 URL을 반환하는 `getBaseUrl()` 패턴을 별도로 구현해야 했습니다.

로컬 환경에서는 `http://localhost:${process.env.PORT ?? 3000}`으로 처리하는데, `PORT` 환경변수가 설정되지 않으면 포트가 3000으로 고정되어 커스텀 포트로 실행 시 서버 사이드 fetch가 실패할 수 있는 한계가 있습니다. 그럼에도 단일 명령어 실행(`pnpm dev`)으로 배포와 개발 환경을 동시에 처리할 수 있고, json-server 같은 외부 의존성 없이 Next.js만으로 전체 스택을 관리할 수 있다는 점에서 이 방식을 선택했습니다.

---

## 3. 폴더 구조 및 아키텍처

### 구조

컴포넌트를 도메인 단위로 나누면(`/chart`, `/table`, `/filter`) 범용 UI와 도메인 로직이 뒤섞여 어떤 컴포넌트가 어디서 사용되는지 파악하기 어렵습니다.
반면 역할 단위로만 나누면(`/atoms`, `/molecules`, `/organisms`) 기능 파악을 위해 여러 계층을 넘나들어야 했습니다.

따라서 두 방식을 결합해 **역할(ui/shared)로 재사용성을 보장하고, 기능(feature)으로 응집도를 높이는** Layered + Feature 혼합 구조를 선택했습니다.

**컴포넌트 분리 기준**

- `ui/`: 도메인을 모르는 컴포넌트. store나 훅에 의존하지 않고 props만으로 동작합니다. 어느 프로젝트에나 가져다 사용할 수 있음.
- `shared/`: `ui/`를 조합한 레이아웃 패턴. 특정 도메인 store에는 연결해선 안됨. (`AsyncBoundary`, `ChartShell` 등)
- `feature/` (filter/, chart/, table/, campaign/): 비즈니스 로직과 store가 결합된 지점. 이 계층에서만 `useFilterParams`, `useCampaignTable` 같은 도메인 훅을 호출.

**의존성 규칙**

역방향 import를 금지해 하위 계층이 상위 계층을 참조하지 못하도록 했습니다.
`ui/Button`이 특정 도메인 훅을 참조하는 순간 재사용성이 깨지는 것을 구조적으로 방지합니다.

```
ui/ → shared/ → feature(filter/, chart/, table/, campaign/)
```

단, 이 구조를 사용하기 위해선 새 컴포넌트가 `ui/`인지 `shared/`인지 `feature/`인지 명확한 규칙이 필요합니다. 규칙이 명확하지 않으면 위치 결정에 시간 비용이 추가됩니다.

따라서 이 프로젝트에서는 "특정 도메인 store에 직접 연결하는가"를 `shared/`와 `feature/`의 경계 기준으로 정의해 CLAUDE.md에 명시했습니다.

다음은 최종 폴더 구조입니다.

```
src/
├── app/
│   ├── api/              # Next.js API Routes (json-server 대체)
│   │   ├── campaigns/    # GET /api/campaigns
│   │   └── daily_stats/  # GET /api/daily_stats
│   ├── layout.tsx        # QueryProvider, 폰트
│   ├── page.tsx          # 대시보드 메인 (서버 컴포넌트)
│   └── providers.tsx     # 클라이언트 프로바이더
│
├── components/
│   ├── ui/               # 원자 컴포넌트 — 도메인 무관, Props만으로 동작
│   ├── shared/           # 구조 컴포넌트 — ui/를 조합한 레이아웃 패턴
│   ├── filter/           # 글로벌 필터 기능 컴포넌트
│   ├── chart/            # 차트 기능 컴포넌트
│   │   ├── daily-chart/
│   │   ├── platform-chart/
│   │   └── ranking-chart/
│   ├── table/            # 캠페인 테이블 기능 컴포넌트
│   └── campaign/         # 캠페인 등록 모달
│
├── hooks/                # 커스텀 훅 (비즈니스 로직)
├── lib/                  # 유틸리티 (api, normalize, metrics, format)
├── types/                # TypeScript 타입 정의
├── constants/            # 상수 및 파생 타입
└── data/
    └── db.json           # Mock 데이터 원본
```

### 데이터 정규화 계층

실제 API 응답에는 `"facebook"`, `"2000000원"`, `"2026/04/12"` 처럼 형식이 일관되지 않은 데이터가 혼재되어 있습니다. 이를 컴포넌트나 훅에서 그때그때 처리하면 같은 정규화 로직이 여러 곳에 분산되고, 누락 시 UI까지 비정형 데이터가 그대로 노출됩니다.

따라서 `lib/normalize.ts`를 정규화의 단일 진입점으로 두고, 훅은 항상 정규화된 타입(`Campaign`, `DailyStat`)만 다루도록 강제했습니다.

```
db.json
  └─ API Routes (app/api/)
       └─ fetchCampaigns / fetchDailyStats (lib/api.ts)
            └─ normalizeCampaigns / normalizeDailyStats (lib/normalize.ts)
                 └─ TanStack Query (useCampaignsSuspense / useDailyStatsSuspense)
                      └─ 집계 훅 (useCampaignTable / useChartData / usePlatformChartData)
                           └─ 파생 지표 계산 (lib/metrics.ts)
                                └─ 렌더링 컴포넌트
```

---

## 4. 컴포넌트 설계

### 공통 설계 규칙

모든 컴포넌트에 일관되게 적용한 원칙입니다.

- **네이티브 HTML 확장**: `Button`, `Input`, `Select` 등 `ui/` 컴포넌트는 기본 HTML 요소의 props(`ButtonHTMLAttributes`, `InputHTMLAttributes`)를 상속해 `onClick`, `disabled`, `aria-*` 등 네이티브 속성을 그대로 전달
- **단방향 의존성**: `ui/ → shared/ → feature/` 방향만 허용
- **`'use client'` 최소화**: `useState`, `useEffect`, 이벤트 핸들러가 필요한 컴포넌트에만 선언
- **렌더링 성능**: 순수 렌더링 컴포넌트(`DailyChart`, `PlatformChart`, `RankingChart`)는 `React.memo`로 감싸고 연산 비용이 있는 집계·필터·정렬은 `useMemo`로 분리

---

### 1. 차트 컴포넌트 설계

→ 틀 / 통신 / 순수 컴포넌트

#### WHY

일별·플랫폼·랭킹 3개 차트는 모두 같은 구조를 가집니다.

1. 카드 UI (레이아웃)
2. 데이터 패칭 + 로딩·에러 처리
3. 차트 렌더링

만약 이 구조를 각 차트에서 처리했다면 다음과 같은 문제가 발생할 수 있습니다.

- **레이아웃·스타일**
  - 통일된 스타일 적용 가능
  - 카드 UI, 제목, 필터 요약을 3곳에 각자 작성 → 변경 시 3곳 동시 수정 필요
- **로딩·에러 처리**
  - Suspense + ErrorBoundary 조합을 쉽게 적용 가능
  - 데이터 페칭 시 공통된 에러, 로딩 처리 가능 → 각 차트에서 래퍼를 직접 설치한다면 누락 가능
- **리렌더 비용**
  - 통신과 렌더링이 한 컴포넌트에 섞이면 필터 변경 때마다 Recharts 전체를 다시 그림 → 통신과 렌더링을 분리

#### HOW

따라서 반복을 줄이고 이 세 문제를 각 레이어에서 한 번씩 해결하기 위해 틀 / 통신 / 순수 컴포넌트 구조를 만들었습니다.

```
ChartShell (Section)         ← 틀: 카드 레이아웃
  AsyncBoundary              ← 틀: 로딩·에러 경계 (Suspense + ErrorBoundary)
    ChartContent        ← 통신: 데이터 패칭 + props 변환
      Chart             ← 순수 컴포넌트: 렌더링만
```

#### ChartShell + AsyncBoundary

세 차트의 공통 레이아웃을 `ChartShell`로 추출하고, Suspense와 ErrorBoundary를 `AsyncBoundary` 하나로 묶어 `ChartShell` 안에 내장했습니다.

차트를 추가할 때 레이아웃과 경계 처리를 별도로 신경 쓰지 않고 `title`, `header`, `children`만 전달하면 됩니다. 테이블 Section도 동일하게 `AsyncBoundary`로 Content를 감싸는 방식으로 통일했습니다.

```tsx
// AsyncBoundary
<ErrorBoundary>
  <Suspense fallback={fallback || <LoadingFallback />}>{children}</Suspense>
</ErrorBoundary>

// ChartShell
export default function ChartShell({ title, header, children }: ChartShellProps) {
  return (
    <section>
      <div>
        <div>
          <h2>{title}</h2> {/* 차트 이름 */}
          <FilterSummary /> {/* 글로벌 필터 정보 */}
        </div>
        {header} {/* 토글 등 차트에 추가적으로 필요한 React Node */}
      </div>

      <AsyncBoundary>{children}</AsyncBoundary>
    </section>
  )
}

// 사용 예시
// ChartShell이 AsyncBoundary를 내장 — 차트는 title과 header만 전달
<ChartShell title="일별 추이" header={<MetricToggle ... />}>
  <DailyChartContent activeMetrics={activeMetrics} />
</ChartShell>
```

#### Content

`useSuspenseQuery`를 사용하기 위해선 `'use client'`가 필요합니다.
Section이 메트릭 토글 상태를 소유하고 있어, Section에 `'use client'`를 선언하면 하위 트리 전체가 클라이언트 번들에 포함됩니다.
데이터 패칭을 Content로 분리하고 `'use client'`를 Content에만 선언해 Section은 서버 컴포넌트로 유지했습니다. TanStack Query 캐시 덕분에 같은 쿼리를 여러 Content에서 호출해도 네트워크 요청은 한 번만 발생합니다.

```
DailyChartSection   ← 서버 컴포넌트. 'use client' 없음. 메트릭 토글 상태 소유
  DailyChartContent ← 'use client'. useSuspenseQuery 호출. 데이터를 Chart에 전달
```

#### Chart

Content가 데이터를 받아 차트까지 직접 렌더링하면, 필터가 바뀌거나 메트릭 토글이 변경될 때마다 Recharts 전체가 리렌더됩니다.

따라서 렌더링을 별도 Chart 컴포넌트로 분리하고 `React.memo`로 감쌌습니다. Content로부터 받는 `data`와 `activeMetrics` props가 바뀌지 않으면 차트를 다시 그리지 않습니다.

```
DailyChartContent ← data 변환 후 props 전달
  DailyChart      ← React.memo. props가 바뀔 때만 렌더링
```

### 2. 컴파운드 컴포넌트 모달 설계

#### WHY

초기 구현은 `title`, `onClose`를 Modal props로 받아 내부에서 Header·Content·Footer를 직접 렌더링하는 방식이었습니다. 현재는 모달이 한 종류지만, 이 구조에서는 레이아웃이 Modal 안에 고정되어 새 모달이 추가될 때마다 다른 레이아웃이 필요하면 Modal props를 수정하거나 새 Modal 컴포넌트를 따로 만들어야 합니다. 또한 캠페인 등록처럼 `<form>`이 Content와 Footer를 함께 감싸야 하는 구조도 고정 레이아웃에서는 표현할 수 없습니다.

#### HOW

`Modal.Header` / `Modal.Content` / `Modal.Footer`를 서브 컴포넌트로 분리하고 Context로 연결하는 컴파운드 패턴으로 재설계했습니다. 사용처에서 서브 컴포넌트를 자유롭게 조합할 수 있어 Modal 컴포넌트를 수정하지 않고도 다양한 레이아웃을 구성할 수 있습니다. `onClose`는 최상위 `Modal`이 Context에 주입하고 `Modal.Header`가 직접 꺼내 쓰므로, 사용처에서 하위 컴포넌트에 별도로 전달할 필요도 없습니다.

**결과물 구조**

```tsx
// 사용하는 쪽에서 onClose를 헤더에 직접 넘길 필요 없음
<Modal>
  <Modal.Header>캠페인 등록</Modal.Header>
  <form>
    <Modal.Content>...</Modal.Content>
    <Modal.Footer>...</Modal.Footer>
  </form>
</Modal>
```

### 3. 모달 속 Form 설계

#### WHY

폼에는 모든 입력 항목이 label·id 연결, 에러 메시지 표시, 단위 표기(`원`, `일`)라는 공통 구조를 가집니다. 이를 각 항목마다 직접 처리하면 접근성 처리가 중복되고, 그렇다고 `FormInput`, `FormSelect`, `FormDateField` 처럼 입력 타입별 wrapper를 따로 만들면 입력 종류가 늘어날수록 wrapper도 함께 늘어납니다.

#### HOW

label·error·suffix 처리를 하나의 `FormItem`이 일괄 담당하도록 설계했습니다. `useId()`로 id를 자동 생성하고 `React.cloneElement`로 자식 input에 주입해 `htmlFor`와 `id`를 항상 연결합니다. `Input`, `Select`, `DateInput` 등 이미 만들어진 `ui/` 컴포넌트를 독립적으로 유지하면서, `FormItem`이 접근성 연결을 일관되게 처리합니다.

**결과물 구조**

```tsx
// FormItem이 id 자동 생성 → label htmlFor 연결 → 에러 표시를 일괄 처리
<FormItem label="예산" required error={errors.budget?.message} suffix="원">
  <Input type="number" {...register('budget', { valueAsNumber: true })} />
</FormItem>

<FormItem label="광고 매체" required error={errors.platform?.message}>
  <Select options={PLATFORM_OPTIONS} {...register('platform')} />
</FormItem>
```

---

## ➕ UX 개선

### 글로벌 필터를 URL로 관리

#### WHY

Zustand로 필터 상태를 관리하면 필터가 적용된 화면을 공유하거나 북마크할 수 없습니다. 또 새로고침하면 필터가 초기화되고, 뒤로가기로 이전 필터 상태로 되돌아갈 수도 없습니다. 대시보드처럼 필터가 화면 전체에 영향을 미치는 경우, URL이 상태의 단일 진실 공급원이 되어야 한다고 판단했습니다.

#### HOW

Zustand `filterStore`를 제거하고 `useFilterParams` 훅으로 전환했습니다. URL 파라미터를 파싱해 상태를 읽고, 변경 시 URL을 갱신합니다.

1. 기본값은 URL에서 생략
   : URL이 길어지는 것을 방지하기 위해 기본 값 상태는 파라미터에 포함하지 않는 방식을 택해 URL을 간결히 유지했습니다.

2. `push` & `replace` 전략: 필터를 자주 바꾸면 뒤로가기 스택이 쌓이므로 일반 변경은 `replace`로 히스토리를 덮어씁니다. 초기화는 의미 있는 상태 전환이므로 `push`로 히스토리에 남겼습니다.

**결과물 구조**

```
전체 선택:      /?start=2026-04-01&end=2026-04-30         (platforms, statuses 생략)
일부 선택:      /?start=...&end=...&platforms=Google,Meta&statuses=active
특정 날짜+상태: /?start=2026-03-01&end=2026-03-31&statuses=paused
```

결과적으로 새로고침·뒤로가기·북마크에서 동일한 필터 상태가 유지되고, URL 공유 시 수신자도 같은 화면을 확인할 수 있습니다.

### 글로벌 필터 값 표시

글로벌 필터는 전 차트와 테이블에 적용되지만 상단에 고정되어있어 그 설정 값을 확인하기 위해선 상단으로 스크롤을 이동해야 했습니다.

따라서 `FilterSummary` 컴포넌트를 만들어 각 차트 카드 내에 포함시켰습니다.
현재 적용된 필터 조건을 차트마다 표시해 사용자가 어느 위치에서도 필터 상태를 확인할 수 있도록 했습니다.
