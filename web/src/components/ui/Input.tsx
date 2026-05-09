import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = ({ 
  label, 
  error, 
  leftIcon, 
  rightIcon, 
  className = '', 
  ...props 
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-label-lg font-semibold text-on-surface">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-outline">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            ${className}
            w-full px-3 py-2 rounded-default border border-outline 
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            text-on-surface placeholder:text-outline-variant transition-all
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-status-critical' : ''}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-outline cursor-pointer hover:text-primary transition-colors">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs text-status-critical font-medium">
          {error}
        </span>
      )}
    </div>
  );
};
