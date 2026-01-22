import { Routes, Route } from "react-router-dom"
import EventGallery from "./_lib/routes/EventGallery"
import SessionGallery from "./_lib/routes/SessionGallery"
import { HomePage } from "./_lib/routes/HomePage"
import { Header } from "./_lib/components/Header"

export default function App() {
  return (
    <div className="dark min-h-[100svh] flex justify-center bg-black">
      <div className="w-full max-w-[430px] min-h-[100svh] flex flex-col bg-background text-foreground">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event/:eventId" element={<EventGallery />} />
          <Route path="/session/:sessionId" element={<SessionGallery />} />
          <Route path="*" element={<div className="flex-1 flex items-center justify-center text-muted-foreground">Not found</div>} />
        </Routes>
      </div>
    </div>
  )
}
