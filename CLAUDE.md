# CLAUDE.md

Claude Code가 이 프로젝트에서 반드시 따라야 하는 규칙과 컨텍스트.
코드를 생성하거나 수정하기 전에 반드시 이 파일을 읽을 것.

---

## 프로젝트 한 줄 요약

광고 캠페인 성과 대시보드. json-server로 db.json을 API로 제공하고, Next.js + TypeScript로 필터/차트/테이블을 구현한다.

---

## 기술 스택

| 역할            | 선택                         |
| --------------- | ---------------------------- |
| Framework       | Next.js 16 (App Router)      |
| Language        | TypeScript — strict 모드     |
| Runtime         | React 19                     |
| 패키지 매니저   | pnpm                         |
| 스타일          | Tailwind CSS v4              |
| 서버 상태       | TanStack Query v5            |
| 클라이언트 상태 | Zustand                      |
| 차트            | Recharts                     |
| 폼 검증         | react-hook-form + zod        |
| API 서버        | json-server (db.json → REST) |
| 아이콘          | lucide-react                 |

---

## 폴더 구조

Layered + Feature 혼합형 구조를 사용한다.

```
src/
├── app/
│   ├── layout.tsx          # QueryProvider, 폰트
│   ├── page.tsx            # 대시보드 메인
│   └── providers.tsx       # 클라이언트 프로바이더
│
├── components/
│   ├── ui/                 # 도메인 없는 원자 컴포넌트 (Button, Badge, Modal 등)
│   ├── filter/             # 필터 기능 컴포넌트
│   ├── chart/              # 차트 컴포넌트
│   ├── table/              # 테이블 컴포넌트
│   └── campaign/           # 캠페인 관련 컴포넌트
│
├── hooks/                  # 커스텀 훅
├── store/                  # Zustand 스토어
├── lib/                    # 유틸리티 함수
├── types/                  # TypeScript 타입 정의
└── constants/              # 상수 정의
```

- `ui/` 컴포넌트는 도메인 의존성 없이 Props만으로 동작해야 함
- 기능별 컴포넌트(`filter/`, `chart/` 등)는 해당 도메인에 특화된 로직만 포함

---

## 데이터 정규화 규칙 (normalize.ts에서 처리)

db.json에는 다음 이슈가 있다. API 응답을 그대로 쓰지 말고 반드시 정규화 후 사용할 것.

| 필드                       | 문제                                   | 처리 방법                              |
| -------------------------- | -------------------------------------- | -------------------------------------- |
| `platform`                 | `"facebook"`, `"Facebook"`, `"네이버"` | → `"Meta"`, `"Naver"` 로 매핑          |
| `status`                   | `"running"`, `"stopped"`               | → `"active"`, `"ended"` 로 매핑        |
| `budget`                   | `"2000000원"` (문자열), `null`         | 숫자 파싱, null → 0                    |
| `startDate`                | `"2026/04/12"` (슬래시 포맷)           | → `"2026-04-12"`                       |
| `impressions`, `clicks` 등 | `null`                                 | → 0                                    |
| 중복 stats                 | 동일 campaignId + date 중복 존재       | campaignId+date 키 기준 첫 번째만 사용 |

---

## 파생 지표 계산

모두 `lib/metrics.ts`에서 처리. 분모가 0이면 `null` 반환, UI에서 `"-"` 표시.

```
CTR  = (clicks / impressions) * 100       단위: %
CPC  = cost / clicks                       단위: 원
ROAS = (conversionsValue / cost) * 100    단위: %
```

---

## 개발 규칙

### 1. 코드 작성

- `any` 타입 사용 금지. 불확실하면 `unknown` + type narrowing
- TypeScript strict 모드 위반 없이 모든 타입 에러를 해결할 것
- `console.log` 코드에 남기지 말 것
- 매직 넘버는 `src/constants/`에 상수로 정의
- **에러 핸들링**: API 호출 실패 시 사용자에게 에러 상태를 명시적으로 표시할 것 (빈 화면 금지)
- **로딩 상태**: 데이터 fetching 중에는 반드시 로딩 UI를 표시할 것

### 2. 데이터 레이어

- 데이터는 반드시 fetch로 가져올 것 (import 금지)
- `db.json` 원본 절대 수정 금지
- 신규 등록 데이터는 브라우저 메모리 내에서만 유지되어도 무방 (새로고침 시 초기화 허용)
- **서버 상태** (campaigns, daily_stats): TanStack Query
- **글로벌 UI 상태** (필터): Zustand filterStore
- **로컬 UI 상태** (모달 open, 정렬, 페이지): useState
- **신규 캠페인 등록**: API 호출 없이 `queryClient.setQueryData`로 캐시에 직접 추가

### 3. 컴포넌트 레이어

- `'use client'`는 이벤트 핸들러, useState, useEffect가 있을 때만 사용
- 비즈니스 로직은 훅으로 분리, 컴포넌트는 렌더링만
- Props 타입은 컴포넌트 파일 상단에 interface로 선언
- **렌더링 성능**: 차트 컴포넌트는 `React.memo`, 무거운 연산은 `useMemo`, 리스트 렌더링 시 `key`는 index 대신 고유 id 사용
- 불필요한 `useEffect` 금지 — 파생 값은 렌더 중 계산, 이벤트 핸들러로 처리 가능한 것은 effect 쓰지 말 것
- **UX & 접근성**
  - 모든 인터랙티브 요소에 `aria-label` 등 ARIA 속성 부여
  - 필터·폼의 선택/변경 결과는 즉시 시각적으로 피드백 (로딩 스피너, 비활성화 처리 등)
  - 레이아웃은 모바일~데스크톱 반응형으로 구성 (Tailwind 반응형 접두사 활용)
- **네이밍**
  - 컴포넌트 파일: PascalCase (`CampaignTable.tsx`)
  - 훅 파일: camelCase, `use` 접두사 (`useCampaigns.ts`)
  - 그 외 파일: kebab-case (`filter-store.ts`)
  - 폴더: kebab-case

### 4. 협업

**브랜치 전략**

- TODO.md의 feature 단위로 브랜치를 생성한다 (`feat/setup`, `feat/filter` 등)
- 해당 브랜치에서는 그 feature에 해당하는 작업만 진행한다
- 다른 feature 작업이 필요해지면 별도 브랜치를 만든다

**커밋 메시지**

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 기타 변경사항
```

---

## AI 활용 문서화

이 프로젝트는 AI 활용도가 평가 항목(20점)에 포함된다. 작업 중 아래 기준에 따라 `AI_USAGE.md`를 지속적으로 업데이트할 것.

- 사용한 AI 도구와 사용 이유
- 주요 프롬프트 및 의사결정 과정
- AI 결과물을 직접 수정한 사례 (무엇을, 왜 수정했는지)

---

## TODO.md 워크플로우

**세션 시작 시:** `TODO.md`가 루트에 존재하면 자동으로 읽고 내용을 파악한다.
사용자가 별도 지시 없이 작업을 요청하면 TODO.md의 미완료 항목(`- [ ]`)을 기준으로
우선순위를 판단한다.

**작업 완료 시:** 해당 항목을 `- [ ]` → `- [x]`로 즉시 업데이트한다.

**세션 종료 시:** 사용자가 "세션 종료" 또는 "오늘 마무리"라고 하면 TODO.md의
진행 상황을 최종 업데이트하고 메모 섹션에 오늘 한 작업 요약을 추가한다.
