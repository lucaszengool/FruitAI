'use client';

import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className = '', hover = false, children, ...props }: CardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const { onDrag, onDragEnd, onDragStart, ...restProps } = props as any;
  
  if (hover) {
    return (
      <motion.div
        className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        transition={{ duration: 0.2 }}
        {...restProps}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
      {...restProps}
    >
      {children}
    </div>
  );
}