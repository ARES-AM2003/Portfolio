import Sidebar from '@/components/Sidebar'
import HeroSection from '@/components/HeroSection'

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:pl-[355px]">
        <HeroSection />
      </main>
    </div>
  )
}
