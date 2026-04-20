export const dynamic = 'force-dynamic'

import GlobalFilter from '@/components/filter/GlobalFilter'
import DailyChartSection from '@/components/chart/daily-chart/DailyChartSection'
import PlatformChartSection from '@/components/chart/platform-chart/PlatformChartSection'
import CampaignTableSection from '@/components/table/CampaignTableSection'
import CampaignRegisterModal from '@/components/campaign/CampaignRegisterModal'

export default function Home() {
  return (
    <main className="min-h-screen bg-secondary p-6 space-y-4">
      <GlobalFilter />
      <DailyChartSection />
      <CampaignTableSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlatformChartSection />
        <PlatformChartSection />
      </div>

      {/* Modal Section */}
      <CampaignRegisterModal />
    </main>
  )
}
