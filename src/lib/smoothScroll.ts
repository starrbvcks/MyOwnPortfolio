export function scrollToSection(hash: string) {
  if (typeof window === "undefined") return;

  const targetHash = hash.startsWith("#") ? hash : `#${hash}`;
  const section = document.querySelector<HTMLElement>(targetHash);

  if (!section) {
    window.location.hash = targetHash;
    return;
  }

  window.history.pushState(null, "", targetHash);

  const headerOffset = 86;
  const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: "smooth",
  });
}
