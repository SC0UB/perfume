/**
 * Resolve a path under /public against Vite's BASE_URL so the static export
 * works whether it's served from the domain root or a sub-path.
 *   asset('assets/bottles/citron.avif') -> '/assets/bottles/citron.avif'
 */
export const asset = (p: string): string =>
  import.meta.env.BASE_URL + p.replace(/^\/+/, '');
