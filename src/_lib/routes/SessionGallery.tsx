import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getSessionManifest, assetUrl, type SessionManifest, type Asset } from "../api"

export default function SessionGallery() {
  const { sessionId } = useParams()
  const [manifest, setManifest] = useState<SessionManifest | null>(null)

  useEffect(() => {
    if (!sessionId) return
    getSessionManifest(sessionId).then(setManifest)
  }, [sessionId])

  if (!manifest) return <p>Loading…</p>

  return (
    <div className="grid">
      {manifest.assets.map((a: Asset, i: number) => {
        const src = assetUrl(a.path)

        if (a.kind === "video" || a.kind === "strip_video") {
          return (
            <video
              key={i}
              src={src}
              controls
              playsInline
              preload="metadata"
            />
          )
        }

        return <img key={i} src={src} loading="lazy" />
      })}
    </div>
  )
}
