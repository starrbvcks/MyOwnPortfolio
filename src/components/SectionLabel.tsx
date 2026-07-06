type SectionLabelProps = {
  eyebrow: string;
  title: string;
  id?: string;
};

export function SectionLabel({ eyebrow, title, id }: SectionLabelProps) {
  return (
    <div id={id} className="mb-8 flex flex-col gap-3 sm:mb-12">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-pink">
        {eyebrow}
      </p>
      <h2 className="max-w-4xl font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-normal text-bone sm:text-5xl lg:text-6xl">
        {title}
      </h2>
    </div>
  );
}
