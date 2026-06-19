import { Instagram } from 'lucide-react';
import TikTokIcon from './TikTokIcon';

/** Bottom-right social links. */
export default function Socials() {
  return (
    <div className="socials">
      <a
        className="icon-btn round"
        href="https://www.instagram.com/ciaokombucha"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <Instagram size={18} strokeWidth={1.7} />
      </a>
      <a
        className="icon-btn round"
        href="https://www.tiktok.com/@ciaokombucha"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
      >
        <TikTokIcon size={18} />
      </a>
    </div>
  );
}
