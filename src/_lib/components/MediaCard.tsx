/**
 * MediaCard - Standard mobile media display component
 * Supports both images and videos with consistent styling
 * Mobile-first responsive design
 */

type MediaCardProps = {
  /** Image or video source URL */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Media type - defaults to 'image' */
  type?: 'image' | 'video';
  /** Aspect ratio class (e.g., 'aspect-[1/3]', 'aspect-[3/4]') */
  aspectRatio?: string;
  /** Additional className for the container */
  className?: string;
  /** Whether video should autoplay (only applies to video type) */
  autoPlay?: boolean;
  /** Whether video should loop (only applies to video type) */
  loop?: boolean;
};

export function MediaCard({
  src,
  alt = '',
  type = 'image',
  aspectRatio = 'aspect-[1/3]',
  className = '',
  autoPlay = true,
  loop = true,
}: MediaCardProps) {
  return (
    <div className={`w-full px-2 ${className}`}>
      <div
        className={`relative overflow-hidden rounded-2xl border border-border bg-card ${aspectRatio}`}
      >
        {type === 'video' ? (
          <video
            src={src}
            autoPlay={autoPlay}
            loop={loop}
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
