'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import FormItem from '@/components/ui/FormItem'
import DateInput from '@/components/ui/DateInput'
import { useCampaignRegisterModal } from '@/hooks/useCampaignRegisterModal'
import { campaignRegisterSchema, type CampaignRegisterFormValues } from '@/lib/campaign-schema'
import { queryKeys } from '@/lib/query-keys'
import { PLATFORMS } from '@/constants'
import type { Campaign, Platform } from '@/types'

const PLATFORM_OPTIONS = PLATFORMS.map((p) => ({ value: p, label: p }))

export default function CampaignRegisterModal() {
  const { isOpen, close } = useCampaignRegisterModal()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CampaignRegisterFormValues>({
    resolver: zodResolver(campaignRegisterSchema),
    defaultValues: {
      platform: '' as Platform,
    },
  })

  const startDate = useWatch({ control, name: 'startDate' })

  const handleClose = () => {
    close()
    reset()
  }

  const onSubmit = (data: CampaignRegisterFormValues) => {
    const newCampaign: Campaign = {
      id: crypto.randomUUID(),
      name: data.name,
      status: 'active', // 상태는 진행중으로 고정
      platform: data.platform,
      budget: data.budget,
      startDate: data.startDate,
      endDate: data.endDate,
    }

    queryClient.setQueryData<Campaign[]>(queryKeys.campaigns.all, (prev = []) => [
      ...prev,
      newCampaign,
    ])

    handleClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} aria-label="캠페인 등록">
      <Modal.Header title="캠페인 등록" />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Content className="flex flex-col gap-4">
          <FormItem required label="캠페인명" error={errors.name?.message}>
            <Input type="text" placeholder="캠페인명을 입력해주세요" {...register('name')} />
          </FormItem>

          <FormItem required label="광고 매체" error={errors.platform?.message}>
            <Select
              options={PLATFORM_OPTIONS}
              placeholder="선택해주세요"
              {...register('platform')}
            />
          </FormItem>

          <div className="grid grid-cols-2 gap-3">
            <FormItem required label="예산" suffix="원" error={errors.budget?.message}>
              <Input
                type="number"
                placeholder="0"
                min={100}
                max={1_000_000_000}
                {...register('budget', { valueAsNumber: true })}
              />
            </FormItem>
            <FormItem required label="집행 금액" suffix="원" error={errors.totalCost?.message}>
              <Input
                type="number"
                placeholder="0"
                min={0}
                max={1_000_000_000}
                {...register('totalCost', { valueAsNumber: true })}
              />
            </FormItem>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormItem required label="시작일" error={errors.startDate?.message}>
                  <DateInput
                    value={field.value ?? ''}
                    name={field.name}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <FormItem required label="종료일" error={errors.endDate?.message}>
                  <DateInput
                    value={field.value ?? ''}
                    name={field.name}
                    min={startDate}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />
          </div>
        </Modal.Content>

        <Modal.Footer>
          <Button type="button" variant="default" size="sm" onClick={handleClose}>
            취소
          </Button>
          <Button type="submit" variant="solid" size="sm">
            등록
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
