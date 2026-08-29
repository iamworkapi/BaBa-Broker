import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const VARIANTS = {
  up: { hidden: { opacity: 0, y: 48 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 260,
  damping: 22,
  mass: 0.8,
};

const SMOOTH_TRANSITION = {
  duration: 0.65,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export function MotionSection({
  children,
  variant = 'up',
  delay = 0,
  duration,
  once = true,
  amount = 0.12,
  rootMargin = '0px 0px -60px 0px',
  className = '',
  as = 'div',
  ...rest
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount, rootMargin });

  const variants = VARIANTS[variant] || VARIANTS.up;
  const transition = duration
    ? { duration, ease: SMOOTH_TRANSITION.ease, delay }
    : { ...SPRING_TRANSITION, delay };

  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerContainer({ children, delay = 0, className = '', as = 'div', ...rest }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1, rootMargin: '0px 0px -40px 0px' });

  const MotionTag = motion[as] || motion.div;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: delay },
    },
  };

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({ children, className = '', variant = 'up', ...rest }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div variants={itemVariants} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

export function AnimatedNumber({ value, duration = 1.2, prefix = '', suffix = '', className = '', format = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const target = Number(value) || 0;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(format ? `₹${current.toLocaleString('en-IN')}` : `${prefix}${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(step);
    };

    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value, duration, prefix, suffix, format]);

  return <span ref={ref} className={className}>{display}</span>;
}
