type PageTitleProps = {
  children: string;
};

/**
 * Absolutely positioned, hidden by default, and revealed only while a route
 * transition wipes the page in — it is never part of the resting layout.
 */
export function PageTitle({ children }: PageTitleProps) {
  return (
    <div className="page-title" aria-hidden>
      <span className="page-title__text font-headline-1">{children}</span>
    </div>
  );
}
