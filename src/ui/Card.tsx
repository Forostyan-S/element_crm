import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', hoverable = false, className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-card transition-all duration-200';
    const variantStyles = variant === 'elevated' ? 'bg-card-elevated' : 'bg-card';
    const hoverStyles = hoverable ? 'hover:shadow-card-hover hover:bg-card-elevated cursor-pointer' : '';

    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
        whileHover={hoverable ? { y: -2, scale: 1.01 } : undefined}
        whileTap={hoverable ? { scale: 0.99 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
