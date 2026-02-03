'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Trail {
  id: number;
  x: number;
  y: number;
}

export function MouseTrail() {
  const [trails, setTrails] = useState<Trail[]>([]);

  useEffect(() => {
    let trailId = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail: Trail = {
        id: trailId++,
        x: e.clientX,
        y: e.clientY,
      };
      
      setTrails((prev) => [...prev.slice(-10), newTrail]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <AnimatePresence>
        {trails.map((trail) => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              left: trail.x - 8,
              top: trail.y - 8,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
              filter: 'blur(2px)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
