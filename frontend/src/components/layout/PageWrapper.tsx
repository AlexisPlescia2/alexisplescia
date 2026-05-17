import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import { useConfigStore } from '../../store/configStore'

// Reduced duration for /shop so it doesn't compete with the card stagger animation
function getPageTransition(pathname: string) {
  if (pathname === '/shop') {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.15, ease: 'easeOut' },
    }
  }
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { type: 'spring' as const, stiffness: 320, damping: 26, mass: 0.85 },
  }
}

export default function PageWrapper() {
  const { loadConfig, loaded } = useConfigStore()
  const location = useLocation()

  useEffect(() => {
    if (!loaded) loadConfig()
  }, [loaded, loadConfig])

  const pageTransition = getPageTransition(location.pathname)

  return (
    <div className="min-h-screen bg-background text-[#e8e8e8] flex flex-col">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-1 pt-14"
          {...pageTransition}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
