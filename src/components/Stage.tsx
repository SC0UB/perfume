import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

import EnvBackground from './EnvBackground';
import EnvGrass from './EnvGrass';
import GoboOverlay from './GoboOverlay';
import FlavorWash from './FlavorWash';
import KineticText from './KineticText';
import FloatingFruit from './FloatingFruit';
import BottleStage from './BottleStage';

import Header from './chrome/Header';
import ActionBar from './chrome/ActionBar';
import Socials from './chrome/Socials';
import Menu from './chrome/Menu';
import SideArrows from './SideArrows';
import CarouselIndicator from './CarouselIndicator';
import DetailPanel from './DetailPanel';
import IngredientsPanel from './IngredientsPanel';

import { useStore } from '../state/store';
import { useFlavorTheme } from '../hooks/useFlavorTheme';
import { useIsMobile } from '../hooks/useMediaQuery';
import { FLOAT } from '../motion/timing';
import { prefersReducedMotion } from '../motion/prefersReducedMotion';

/** The fixed, no-scroll hero stage: all layers + chrome, plus global input. */
export default function Stage() {
  const view = useStore((s) => s.view);
  const sceneRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useFlavorTheme();

  // Idle float: the whole scene breathes (chrome stays put).
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const t = gsap.to(sceneRef.current, {
      y: FLOAT.sceneY,
      duration: FLOAT.scenePeriod,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => {
      t.kill();
    };
  }, []);

  // Keyboard: ←/→ change flavour in detail, Esc returns to the lineup.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (useStore.getState().menuOpen) return;
      const s = useStore.getState();
      if (s.view !== 'detail') return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        s.prevFlavor();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        s.nextFlavor();
      } else if (e.key === 'Escape') {
        s.backToLineup();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Swipe: change flavour in detail; move the coverflow in the mobile lineup.
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;
    const s = useStore.getState();
    if (s.view === 'detail' || (s.view === 'lineup' && isMobile)) {
      dx < 0 ? s.nextFlavor() : s.prevFlavor();
    }
  };

  return (
    <div className={`stage view-${view}`} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <div className="scene" ref={sceneRef}>
        <EnvBackground />
        <FlavorWash />
        <KineticText />
        <FloatingFruit />
        <BottleStage />
        <EnvGrass />
      </div>

      <GoboOverlay />

      {/* Scrims that lift chrome contrast over bright imagery. */}
      <div className="scrim scrim-top" aria-hidden="true" />
      <div className="scrim scrim-bottom" aria-hidden="true" />

      <Header />
      <SideArrows />
      <DetailPanel />
      <IngredientsPanel />
      <CarouselIndicator />
      <ActionBar />
      <Socials />
      <Menu />
    </div>
  );
}
