import React, { useState } from 'react';

const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800', // Gourmet
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800', // Grilled
  'https://images.unsplash.com/photo-1583394238711-683a5f217281?auto=format&fit=crop&q=80&w=800', // Noodles
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'  // Healthy
];

const SafeImage = ({ src, alt, className, style }) => {
  const [error, setError] = useState(false);
  const [randomPlaceholder] = useState(() => 
    PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  );

  const displaySrc = (!src || error) ? randomPlaceholder : src;

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (!error) setError(true);
      }}
    />
  );
};

export default SafeImage;
