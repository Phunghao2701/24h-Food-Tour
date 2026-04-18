import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'inline-block text-center hover-clay-jump border-oat-border';
  
  const variants = {
    primary: 'bg-transparent text-clay-black border-none hover:bg-clay-black hover:text-clay-white hover:border-transparent px-[12.8px] py-[6.4px] rounded-card font-medium',
    white: 'bg-clay-white text-clay-black border hover:bg-oat-light px-[12.8px] py-[6.4px] rounded-card font-medium shadow-clay',
    ghost: 'bg-transparent text-clay-black border border-oat-border px-2 py-2 rounded-card hover:bg-oat-light transition-all',
    pill: 'bg-clay-black text-clay-white hover:bg-slushie-500 hover:text-clay-black px-6 py-3 rounded-pill font-medium shadow-clay uppercase tracking-wide-label text-sm',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
