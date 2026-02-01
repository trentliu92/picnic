import { useMemo, useState } from 'react';
import { Loader } from '@/components/ui/loader';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SaveToPhotosButton } from '@/components/SaveToPhotosButton';
import { cn } from '@/lib/utils';

interface FrameItem {
  id: string;
  name: string;
  src: string;
  fileName: string;
}

function getFileNameFromPath(path: string): string {
  return path.split('/').pop() ?? path;
}

interface FrameOption {
  id: string;
  displayName: string;
  frameName: string;
}

const FRAME_OPTIONS: FrameOption[] = [
  { id: 'manilla-forever', displayName: 'Manilla Forever', frameName: 'Manilla Forever' },
  { id: 'jackzeu', displayName: 'JackZeu', frameName: 'JackZeu' },
  { id: 'innerbloom', displayName: 'Innerbloom', frameName: 'Innerbloom' },
  { id: 'we-found-love', displayName: 'We Found Love', frameName: 'We Found Love' },
  { id: 'hong-kong', displayName: 'Hong Kong', frameName: 'Hong Kong' },
  { id: 'dicey', displayName: 'Dicey', frameName: 'Dicey' },
  { id: 'best-map-app', displayName: 'Best Map App', frameName: 'Best Map App' },
  {
    id: 'kindred-characters',
    displayName: 'Kindred Characters',
    frameName: 'Kindred Characters',
  },
  { id: 'got-game', displayName: 'Got Game', frameName: 'Got Game' },
  { id: 'lucky-you', displayName: 'Lucky You', frameName: 'Lucky You' },
  { id: 'calendar', displayName: 'Calendar', frameName: 'Calendar' },
  {
    id: 'your-queen-and-king',
    displayName: 'Your Queen and King',
    frameName: 'Your Queen and King',
  },
  {
    id: 'let-me-take-you-out',
    displayName: 'Let Me Take You Out',
    frameName: 'Let Me Take You Out',
  },
  { id: 'its-a-deal', displayName: "It's A Deal", frameName: 'Its A Deal' },
  { id: 'orientation', displayName: 'Orientation', frameName: 'Orientation' },
  {
    id: 'take-you-out-again',
    displayName: 'Take You Out Again',
    frameName: 'Take You Out Again',
  },
  { id: 'post-game', displayName: 'Post Game', frameName: 'Post Game' },
  { id: 'movieticket', displayName: 'Movie Ticket', frameName: 'MovieTicket' },
];

type FrameCardProps = {
  frame: FrameItem;
  onClick: () => void;
};

function FrameCard({ frame, onClick }: FrameCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group p-1 relative flex flex-col text-left overflow-hidden rounded bg-neutral-800 shadow-lg active:scale-[0.98] transition-transform duration-150"
      aria-label={`View frame: ${frame.name}`}
    >
      {isLoading && (
        <Loader className="absolute inset-0 z-10 w-full aspect-[720/1525] rounded-2xl bg-neutral-800" />
      )}
      <img
        src={frame.src}
        alt={frame.name}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        className={cn(
          'w-full aspect-[720/1525] object-cover transition-all duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          'group-hover:scale-105 group-active:scale-100'
        )}
      />
      <div className="mt-1 px-2 py-1.5">
        <p className="text-xs text-white/80 font-medium line-clamp-2">{frame.name}</p>
      </div>
    </button>
  );
}

export default function FramesGallery() {
  const [selectedFrame, setSelectedFrame] = useState<FrameItem | null>(null);

  const frames = useMemo((): FrameItem[] => {
    const imports = import.meta.glob('../../assets/frames/*.png', {
      eager: true,
      import: 'default',
    }) as Record<string, string>;

    const byFrameName = new Map<string, { src: string; fileName: string }>();
    for (const [path, src] of Object.entries(imports)) {
      const fileName = getFileNameFromPath(path);
      const frameName = fileName.replace(/\.png$/i, '');
      byFrameName.set(frameName, { src, fileName });
    }

    return FRAME_OPTIONS.flatMap((opt) => {
      const found = byFrameName.get(opt.frameName);
      if (!found) return [];
      return [
        {
          id: opt.id,
          name: opt.displayName,
          src: found.src,
          fileName: found.fileName,
        },
      ];
    });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-6">
      <div className="flex items-baseline justify-between pb-4">
        <h1 className="text-lg font-semibold text-white">Frames</h1>
        <p className="text-xs text-white/60">{frames.length} total</p>
      </div>

      {frames.length === 0 ? (
        <p className="text-center text-neutral-400 py-12">No frames found</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {frames.map((frame) => (
            <FrameCard key={frame.fileName} frame={frame} onClick={() => setSelectedFrame(frame)} />
          ))}
        </div>
      )}

      <Sheet
        open={selectedFrame !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedFrame(null);
        }}
      >
        <SheetContent
          side="bottom"
          className="bg-black/70 backdrop-blur-2xl border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.6)]"
        >
          <SheetHeader className="pb-2">
            <SheetTitle className="text-primary tracking-widest uppercase text-sm font-light">
              {selectedFrame?.name ?? 'Frame'}
            </SheetTitle>
          </SheetHeader>

          {selectedFrame && (
            <div className="px-4 py-6 bg-neutral-800 flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden bg-neutral-800">
                <img
                  src={selectedFrame.src}
                  alt={selectedFrame.name}
                  className="w-full h-auto max-h-[70svh] object-contain"
                />
              </div>
              <SaveToPhotosButton
                url={selectedFrame.src}
                filename={selectedFrame.fileName}
                mimeType="image/png"
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
