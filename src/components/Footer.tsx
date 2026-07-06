import { siteMeta } from "../content";

export function Footer() {
  return (
    <footer className="bg-ink px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t-2 border-bone/15 pt-6 font-mono text-xs uppercase tracking-[0.16em] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Setareh / Web Designer & Web Developer</p>
        <p>{siteMeta.location}</p>
      </div>
    </footer>
  );
}
