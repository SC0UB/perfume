/** Minimal TikTok glyph (lucide has no TikTok icon). Inherits currentColor. */
export default function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.3 2.1 1.5 3.7 3.5 4v2.4c-1.3.1-2.5-.3-3.6-.9v6.1a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.6a3 3 0 1 0 2.1 2.9V3h2.7Z" />
    </svg>
  );
}
