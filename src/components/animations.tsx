'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedSection({ children, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SlideInFromLeft({ children, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
}

export function SlideInFromRight({ children, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
}

export function CarDriveIn({ children, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100, rotate: -5 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: 'spring',
        stiffness: 80,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevEngine({ children }: { children: ReactNode }) {
  return (
    <motion.div
      whileHover={{
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.3,
          repeat: 2,
          repeatType: 'reverse'
        }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

export function RotateOnHover({ children }: { children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export function BounceIn({ children, delay = 0, className = '' }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 10
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {children}
    </motion.div>
  );
}
