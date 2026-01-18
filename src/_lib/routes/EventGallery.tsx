import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getEvent, assetUrl, type EventData, type Session } from "../api"

export default function EventGallery() {
  const { eventId } = useParams()
  const [data, setData] = useState<EventData | null>(null)

  useEffect(() => {
    if (!eventId) return
    getEvent(eventId).then(setData)
  }, [eventId])

  if (!data) return <p>Loading…</p>
  if (!data.sessions?.length) return <p>No sessions yet</p>

  return (
    <div className="grid">
      {data.sessions.map((s: Session) => (
        <Link key={s.session_id} to={`/s/${s.session_id}`} className="card">
          <img src={assetUrl(s.thumb_path)} />
          <div className="meta">
            {new Date(s.created_at).toLocaleString()}
          </div>
        </Link>
      ))}
    </div>
  )
}
