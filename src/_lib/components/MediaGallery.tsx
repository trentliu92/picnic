/**
 * MediaGallery - Secondary plane showcasing photobooth output
 * Frosted glass card design with blurred backgrounds
 * Mobile-first responsive design
 */

import { useRef } from 'react';
import sampleVideo from '../../assets/sample_video.mp4';
import sampleVideo2 from '../../assets/sample_video_2.mp4';

/** Product-style labels for video cards */
const VIDEO_LABELS = [
  { name: 'Engagement Party', codes: ['JAN', '20', '2025'], videoSrc: sampleVideo },
  { name: 'Bridal Shower', codes: ['FEB', '14', '2025'], videoSrc: sampleVideo2 },
  { name: 'Rehearsal Dinner', codes: ['MAR', '18', '2025'], videoSrc: sampleVideo },
  { name: 'Wedding Ceremony', codes: ['APR', '25', '2025'], videoSrc: sampleVideo2 },
  { name: 'Reception', codes: ['APR', '25', '2025'], videoSrc: sampleVideo },
  { name: 'First Dance', codes: ['APR', '25', '2025'], videoSrc: sampleVideo2 },
  { name: 'Cake Cutting', codes: ['APR', '25', '2025'], videoSrc: sampleVideo },
  { name: 'Farewell Brunch', codes: ['APR', '26', '2025'], videoSrc: sampleVideo },
];

type VideoPlaceholderProps = {
  index: number;
};

function VideoPlaceholder({ index }: VideoPlaceholderProps) {
  const label = VIDEO_LABELS[index % VIDEO_LABELS.length];
  const videoSrc = label.videoSrc;
  
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  
  /** Random start offset (0-1.5 seconds) - generated once on first video load */
  const startOffsetRef = useRef<number | null>(null);
  
  /** Set random start time when video is ready */
  const handleLoadedMetadata = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    if (videoRef.current) {
      // Generate offset on first call, then reuse
      if (startOffsetRef.current === null) {
        startOffsetRef.current = Math.random() * 1.5;
      }
      videoRef.current.currentTime = startOffsetRef.current;
    }
  };

  return (
    <div className="group relative flex-shrink-0">
      {/* Outer frosted glass frame */}
      <div
        className="relative w-[160px] overflow-hidden rounded-xl border border-white/10 sm:w-[200px] md:w-[240px]"
        style={{
          // background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        {/* Frame padding - creates the "bigger frame" effect */}
        <div className="p-2 sm:p-2.5 md:p-3">
          {/* Inner video container */}
          <div
            className="flex justify-center items-center h-full w-full overflow-hidden rounded-lg bg-black/40"
            style={{ aspectRatio: '4 / 3' }}
          >
            
            {/* Main video */}
            <video
              ref={mainVideoRef}
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              onLoadedMetadata={() => handleLoadedMetadata(mainVideoRef)}
              className="z-10 h-full"
            />
          </div>
        </div>
        
        {/* Product label section */}
        <div className="border-t border-white/5 px-2 py-2 sm:px-2.5 sm:py-2.5 md:px-3 md:py-3">
          {/* Product name */}
          <p className="mb-1 font-mono text-[8px] font-medium uppercase tracking-[0.1em] text-white/80 sm:text-[9px] md:text-[10px]">
            {label.name}
          </p>
          
          {/* Metadata codes */}
          <div className="flex gap-3 sm:gap-4">
            {label.codes.map((code, i) => (
              <span
                key={i}
                className="font-mono text-[7px] text-white/40 sm:text-[8px] md:text-[9px]"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type MediaGalleryProps = {
  count?: number;
};

export function MediaGallery({ count = 8 }: MediaGalleryProps) {
  const placeholders = Array.from({ length: count }, (_, i) => i);
  
  return (
    <section className="relative w-full pb-6 pt-2 sm:py-6">
      {/* Horizontal scrolling gallery */}
      <div className="relative">
        {/* Scrollable container */}
        <div
          className="flex gap-3 overflow-x-auto pb-2 sm:gap-4 md:gap-5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Left spacer - starts content 1/3 from left */}
          <div className="w-[calc(12px)] flex-shrink-0 sm:w-[calc(13.33vw-16px)]" />
          
          {placeholders.map((index) => (
            <VideoPlaceholder key={index} index={index} />
          ))}
          
          {/* Right spacer */}
          <div className="w-4 flex-shrink-0 sm:w-6" />
        </div>
      </div>
    </section>
  );
}
