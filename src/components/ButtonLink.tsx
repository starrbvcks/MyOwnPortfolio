import type { ReactNode } from "react";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "solid" | "ghost";
};

export function ButtonLink({
  children,
  href,
  variant = "solid",
}: ButtonLinkProps) {
  const styles =
    variant === "solid"
      ? "border-pink bg-pink text-ink hover:bg-pink-strong"
      : "border-bone text-bone hover:border-pink hover:text-pink";

  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center border-2 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.12em] transition-colors ${styles}`}
    >
      {children}
    </a>
  );
}
