import { z } from 'zod'

export const campaignRegisterSchema = z
  .object({
    name: z.string().trim().min(2, '2자 이상 입력해주세요').max(100, '100자 이하로 입력해주세요'),
    platform: z.enum(['Google', 'Meta', 'Naver'] as const, {
      error: '매체를 선택해주세요',
    }),
    budget: z
      .number({ error: '숫자를 입력해주세요' })
      .int('정수를 입력해주세요')
      .min(100, '최소 100원 이상')
      .max(1_000_000_000, '10억 원 이하로 입력해주세요'),
    totalCost: z
      .number({ error: '숫자를 입력해주세요' })
      .int('정수를 입력해주세요')
      .min(0, '0원 이상')
      .max(1_000_000_000, '10억 원 이하로 입력해주세요'),
    startDate: z.string().min(1, '시작일을 선택해주세요'),
    endDate: z.string().min(1, '종료일을 선택해주세요'),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: '종료일은 시작일 이후여야 합니다',
    path: ['endDate'],
  })
  .refine((data) => data.totalCost <= data.budget, {
    message: '집행 금액은 예산을 초과할 수 없습니다',
    path: ['totalCost'],
  })

export type CampaignRegisterFormValues = z.infer<typeof campaignRegisterSchema>
