// Shared Framer Motion Variants for Physics-based UI
// ===================================================

export const SPRING_TIGHT = {
  type: "spring",
  stiffness: 500,
  damping: 30
};

export const SPRING_LOOSE = {
  type: "spring",
  stiffness: 100,
  damping: 20
};

export const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: SPRING_LOOSE 
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 } 
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: SPRING_TIGHT
  }
};

export const listItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: SPRING_LOOSE }
};
