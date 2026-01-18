import { Routes, Route } from "react-router-dom"
import EventGallery from "./_lib/routes/EventGallery"
import SessionGallery from "./_lib/routes/SessionGallery"
import { HomePage } from "./_lib/routes/HomePage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/e/:eventId" element={<EventGallery />} />
      <Route path="/s/:sessionId" element={<SessionGallery />} />
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  )
}
