type GrainOverlayProps = {
  className?: string;
};

export function GrainOverlay({ className = "" }: GrainOverlayProps) {
  return <div aria-hidden="true" className={`grain pointer-events-none ${className}`} />;
}
