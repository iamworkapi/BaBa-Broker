import { useEffect, useRef, useCallback } from 'react';

const revealVariants = {
  up: 'reveal-up',
  down: 'reveal-down',
  left: 'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
};

export default function ScrollReveal({
  children,
  variant = 'up',
  delay = 0,
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  once = true,
  className = '',
}) {
  const ref = useRef(null);
  const revealed = useRef(false);

  const handleIntersect = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (once && revealed.current) return;
        if (!revealed.current) revealed.current = true;
        const el = entry.target;
        const delayMs = Number(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delayMs);
        if (once) observer.disconnect();
      } else if (!once) {
        entry.target.classList.remove('visible');
      }
    });
  }, [once]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleIntersect, threshold, rootMargin]);

  const variantClass = revealVariants[variant] || 'reveal-up';

  return (
    <div
      ref={ref}
      className={`reveal ${variantClass} reveal-delay-${Math.min(delay, 5)} ${className}`}
      data-delay={delay}
    >
      {children}
    </div>
  );
}
