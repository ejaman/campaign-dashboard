import GlobalFilter from '@/components/filter/GlobalFilter'
import FilterDebug from './_debug/FilterDebug'

export default function Home() {
  return (
    <main className="min-h-screen bg-secondary p-6 space-y-4">
      <GlobalFilter />
      <FilterDebug />
    </main>
  )
}
