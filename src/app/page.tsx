export const dynamic = 'force-dynamic'

import GlobalFilter from '@/components/filter/GlobalFilter'
import DailyChartSection from '@/components/chart/DailyChartSection'
import CampaignTableSection from '@/components/table/CampaignTableSection'
import CampaignRegisterModal from '@/components/campaign/CampaignRegisterModal'

export default function Home() {
  return (
    <main className="min-h-screen bg-secondary p-6 space-y-4">
      <GlobalFilter />
      <DailyChartSection />
      <CampaignTableSection />
      {/* <CampaignRegisterModal /> */}
    </main>
  )
}
