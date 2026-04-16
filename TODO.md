# TODO

## 필수 기능

### feat/setup — 프로젝트 초기 설정

- [x] 패키지 설치 (TanStack Query, Zustand, Recharts, react-hook-form, zod, json-server, lucide-react, concurrently)
- [x] json-server 설정 및 db.json 구성
- [x] QueryProvider, providers.tsx 구성
- [x] 스타일 초기 설정 (`globals.css` — Tailwind base, 폰트, CSS 변수 등)
- [x] 타입 정의 (`src/types/index.ts`)
- [ ] 상수 정의 (`src/constants/index.ts`)
- [ ] 데이터 정규화 함수 (`src/lib/normalize.ts`)
- [ ] 파생 지표 계산 함수 (`src/lib/metrics.ts`)

### feat/filter — 글로벌 필터

- [ ] Zustand filterStore 구성 (기간 / 상태 / 매체)
- [ ] 집행 기간 필터 (초기값: 당월 1일~말일)
- [ ] 상태 필터 — 진행중 / 일시중지 / 종료 (다중 선택, 초기값: 전체)
- [ ] 매체 필터 — Google / Meta / Naver (다중 선택, 초기값: 전체)
- [ ] 초기화 버튼 (모든 조건을 초기값으로 복구)
- [ ] 필터 변경 시 하단 차트·테이블 실시간 동기화 (AND 조합)

### feat/chart-daily — 일별 추이 차트

- [ ] 필터링된 캠페인의 일별 데이터 시각화
- [ ] X축(날짜) / Y축(수치) / 범례 구성
- [ ] 메트릭 토글 — 노출수 / 클릭수 (초기값: 둘 다 활성화, 중복 선택 가능)
- [ ] 최소 1개 지표 선택 강제 (비활성화 방지)
- [ ] 호버 시 툴팁으로 해당 날짜 수치 표시

### feat/table — 캠페인 관리 테이블

- [ ] 컬럼 구성: 캠페인명 / 상태 / 매체 / 집행기간 / 총 집행금액 / CTR / CPC / ROAS
- [ ] 정렬: 집행기간 / 총 집행금액 / CTR / CPC / ROAS (오름차순·내림차순)
- [ ] 캠페인명 실시간 검색 (테이블에만 적용)
- [ ] 검색 결과 건수 / 전체 건수 표시
- [ ] 페이지네이션 (1페이지당 10건)
- [ ] ⭐ 체크박스로 캠페인 선택 → 드롭다운으로 상태 일괄 변경

### feat/campaign-modal — 캠페인 등록 모달

- [ ] [캠페인 등록] 버튼 클릭 시 모달 노출
- [ ] 입력 필드: 캠페인명 / 광고 매체 / 예산 / 집행 금액 / 시작일 / 종료일
- [ ] 유효성 검사 (zod + react-hook-form)
  - [ ] 캠페인명: 2자~100자
  - [ ] 광고 매체: Google / Meta / Naver 중 택 1
  - [ ] 예산: 정수, 100원~10억 원
  - [ ] 집행 금액: 정수, 0원~10억 원, 예산 초과 불가
  - [ ] 시작일: 필수
  - [ ] 종료일: 시작일 이후
- [ ] 검사 실패 시 해당 필드 하단에 에러 메시지 표시
- [ ] 자동 설정: 상태 `active` 고정, 캠페인 ID 자동 생성
- [ ] ⭐ 등록 성공 시 `queryClient.setQueryData`로 목록·차트 즉시 반영 (새로고침 없이)

---

## 선택 기능 (가산점)

### feat/chart-platform — 플랫폼별 성과 차트 (Donut)

- [ ] 메트릭 토글: 비용 / 노출수 / 클릭수 / 전환수 (기본값: 비용)
- [ ] 플랫폼별(Google / Meta / Naver) 비중 도넛 차트
- [ ] 메트릭 수치 + 비중(%) 동시 표기
- [ ] ⭐ 차트 클릭 시 글로벌 매체 필터와 양방향 연동 (클릭→필터 적용/해제)

### feat/chart-ranking — 캠페인 랭킹 Top3 (Bar)

- [ ] 메트릭 토글: ROAS / CTR / CPC (기본값: ROAS)
- [ ] 선택 메트릭 기준 상위 3개 캠페인 표시
- [ ] ⭐ 정렬 기준: ROAS·CTR은 높을수록 ↑, CPC는 낮을수록 ↓

---

> ⭐ 는 평가 포인트로 명시된 항목
