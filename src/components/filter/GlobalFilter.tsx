import DateRangePicker from './DateRangePicker'
import PlatformFilter from './PlatformFilter'
import ResetButton from './ResetButton'
import StatusFilter from './StatusFilter'

export default function GlobalFilter() {
  return (
    <div className="flex flex-col gap-3 px-6 py-4 bg-white rounded-xl border border-border lg:flex-row lg:items-center lg:gap-5">
      <DateRangePicker />
      <div className="flex flex-col gap-3 md:flex-row lg:contents">
        <StatusFilter />
        <PlatformFilter />
      </div>
      <ResetButton className="self-end lg:ml-auto lg:self-auto" />
    </div>
  )
}
