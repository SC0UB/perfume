/**
 * Stage provider — the single seam between the real-time 3D stage and the
 * optional photoreal video stage (Phase 8).
 *
 * Swap the one active export below to switch implementations. Both render the
 * cans behind the SAME HUD / controls / state / ambient-colour logic, so
 * nothing else changes.
 */

export { ThreeStage as Stage } from './three/ThreeStage';

// Photoreal upgrade path — provide per-flavour webm loops, then swap to:
// export { VideoStage as Stage } from './three/VideoStage';
