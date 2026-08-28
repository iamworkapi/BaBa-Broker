import { useEffect, useRef } from 'react';

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.12,
};

let observerInstance = null;

function getObserver() {
  if (!observerInstance && typeof window !== 'undefined') {
    observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerInstance.unobserve(entry.target);
          }
        });
      },
      OBSERVER_OPTIONS,
    );
  }
  return observerInstance;
}

export function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = getObserver();
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  return ref;
}

export function useScrollRevealBatch(selector = '.reveal') {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const nodes = container.querySelectorAll(selector);
    const observer = getObserver();
    nodes.forEach((node, i) => {
      node.style.transitionDelay = `${Math.min(i + 1, 5) * 0.1}s`;
      observer.observe(node);
    });
    return () => {
      nodes.forEach((node) => observer.unobserve(node));
    };
  }, [selector]);

  return containerRef;
}
