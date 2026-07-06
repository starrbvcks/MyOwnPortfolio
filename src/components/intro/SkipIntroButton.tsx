type SkipIntroButtonProps = {
  onSkip: () => void;
};

export function SkipIntroButton({ onSkip }: SkipIntroButtonProps) {
  return (
    <button
      type="button"
      onClick={onSkip}
      aria-label="Skip intro"
      className="editorial-focus absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center border border-bone/30 bg-ink/70 font-mono text-xl font-semibold text-bone backdrop-blur transition hover:border-pink hover:bg-pink hover:text-ink sm:right-6 sm:top-6"
    >
      ×
    </button>
  );
}
