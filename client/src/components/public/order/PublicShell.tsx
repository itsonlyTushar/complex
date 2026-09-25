// Ordering happens on a phone at the table; on a wider screen every guest page
// stays a phone-width column so the layout never has to stretch.
export function PublicShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto min-h-dvh max-w-md sm:border-x sm:border-border">{children}</div>;
}
