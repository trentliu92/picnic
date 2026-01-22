import { cn } from '@/lib/utils';

type LoaderProps = {
  /** Size variant of the loader */
  size?: 'sm' | 'default';
  /** Additional CSS classes for the container */
  className?: string;
};

/**
 * Picnic branded loading spinner with 3D layered animation effect.
 * Uses the primary brand color.
 */
export function Loader({ size = 'default', className }: LoaderProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('loader', size === 'sm' && 'loader--sm')} />
    </div>
  );
}
