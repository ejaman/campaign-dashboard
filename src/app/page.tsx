import GlobalFilter from '@/components/filter/GlobalFilter'
import DailyChartSection from '@/components/chart/DailyChartSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-secondary p-6 space-y-4">
      <GlobalFilter />
      <DailyChartSection />
    </main>
  )
}
