import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-opacity-90',
    secondary: 'bg-accent-energy text-white hover:bg-opacity-90',
    outline: 'border border-outline text-on-surface hover:bg-surface-muted',
    ghost: 'text-on-surface hover:bg-surface-muted',
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={`
        ${variants[variant]}
        ${className}
        px-4 py-2 rounded-default font-semibold transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
      `}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
