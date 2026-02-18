'use client';

import { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface StoreGridProps {
  children: ReactNode;
  storeIds: string[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

export function StoreGrid({ children, storeIds }: StoreGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={storeIds.join(',')}
    >
      <AnimatePresence mode="popLayout">
        {Array.isArray(children)
          ? children.map((child, i) => (
              <motion.div key={storeIds[i] ?? i} variants={itemVariants} layout>
                {child}
              </motion.div>
            ))
          : <motion.div variants={itemVariants}>{children}</motion.div>
        }
      </AnimatePresence>
    </motion.div>
  );
}
