import wordmark from '../../public/assets/logo/ciao-wordmark.svg?raw';

/**
 * The CIAO KOMBUCHA logotype. Inlined from the fetched SVG (it draws with
 * `currentColor`, so CSS `color` tints it — white over the imagery, etc.).
 * A temporary placeholder lockup, replaced at the rebrand.
 */
export default function Wordmark({
  className = '',
  title = 'Ciao Kombucha',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <span
      className={`wordmark ${className}`}
      role="img"
      aria-label={title}
      // eslint-disable-next-line react/no-danger -- trusted, build-time inlined asset
      dangerouslySetInnerHTML={{ __html: wordmark }}
    />
  );
}
