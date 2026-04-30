/**
 * PlaceholderLogo Component
 * ──────────────────────────
 * A clean, abstract tech symbol to serve as the logo placeholder.
 */

interface PlaceholderLogoProps {
  className?: string;
  size?: number;
}

export function PlaceholderLogo({ className = '', size = 32 }: PlaceholderLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="6" fill="currentColor" />
      <path
        d="M16 2L16 8M16 24L16 30M2 16L8 16M24 16L30 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
