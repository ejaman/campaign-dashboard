'use client'

import Modal from '@/components/ui/Modal'
import { useCampaignRegisterModal } from '@/hooks/useCampaignRegisterModal'

export default function CampaignRegisterModal() {
  const { isOpen, close } = useCampaignRegisterModal()

  return (
    <Modal isOpen={isOpen} onClose={close} title="캠페인 등록">
      <p className="text-sm text-muted-foreground">
        캠페인 등록 폼은 feat/campaign-modal에서 구현합니다.
      </p>
    </Modal>
  )
}
