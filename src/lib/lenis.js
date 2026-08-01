import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenisInstance = null;

export function initLenis() {
  if (typeof window === 'undefined') return null;

  if (!lenisInstance) {
    lenisInstance = new Lenis({
      autoRaf: true,
      lerp: 0.12, // High-performance snappy responsiveness
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchMultiplier: 1.2,
      infinite: false,
    });
  }

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

export function stopLenis() {
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

export function startLenis() {
  if (lenisInstance) {
    lenisInstance.start();
  }
}
