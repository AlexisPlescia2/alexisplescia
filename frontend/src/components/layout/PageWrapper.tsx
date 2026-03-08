import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useConfigStore } from '../../store/configStore'

export default function PageWrapper() {
  const { loadConfig, loaded } = useConfigStore()

  useEffect(() => {
    if (!loaded) loadConfig()
  }, [loaded, loadConfig])

  return (
    <div className="min-h-screen bg-background text-[#e8e8e8] font-body flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
