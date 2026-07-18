type SkipIntroButtonProps = {
  onSkip: () => void;
};

export function SkipIntroButton({ onSkip }: SkipIntroButtonProps) {
  return (
    <button
      type="button"
      onClick={onSkip}
      aria-label="Skip intro"
      className="editorial-focus absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-30 flex min-h-11 min-w-11 items-center justify-center border border-bone/30 bg-ink/80 px-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-bone backdrop-blur transition hover:border-pink hover:bg-pink hover:text-ink sm:right-6"
    >
      Skip
    </button>
  );
}
