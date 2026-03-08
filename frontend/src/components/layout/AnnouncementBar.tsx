import { useConfigStore } from '../../store/configStore'

export default function AnnouncementBar() {
  const { config } = useConfigStore()
  const text = config.announcement_bar

  if (!text) return null

  return (
    <div className="bg-accent text-white text-xs font-body text-center py-2 px-4 tracking-wide">
      {text}
    </div>
  )
}
