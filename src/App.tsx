import { Routes, Route } from "react-router-dom"
import EventGallery from "./_lib/routes/EventGallery"
import SessionGallery from "./_lib/routes/SessionGallery"
import { HomePage } from "./_lib/routes/HomePage"
import { Header } from "./_lib/components/Header"

export default function App() {
  return (
    <div className="min-h-[100svh] flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/e/:eventId" element={<EventGallery />} />
        <Route path="/s/:sessionId" element={<SessionGallery />} />
        <Route path="*" element={<div className="flex-1 flex items-center justify-center text-text-muted">Not found</div>} />
      </Routes>
    </div>
  )
}
