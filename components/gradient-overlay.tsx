import { cn } from '@/lib/utils';

export const GradientOverlay = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "content-[''] absolute inset-0 bg-gradient-to-t from-primary to-secondary-foreground opacity-40",
      className,
    )}
  />
);
