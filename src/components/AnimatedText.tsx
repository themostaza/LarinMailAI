'use client';

import { useState, useEffect } from 'react';

const AnimatedText = () => {
  const words = [
    'automatizzare',
    'migliorare', 
    'potenziare',
    'efficientizzare',
    'ottimizzare',
    'semplificare',
    'accelerare',
    'trasformare'
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsVisible(true);
      }, 300); // Pausa durante la transizione
      
    }, 2000); // Cambia parola ogni 2 secondi

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`inline-block text-[#00D9AA] font-bold transition-all duration-300 ease-in-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 -translate-y-2 scale-95'
      }`}
      style={{ width: 'fit-content' }}
    >
      {words[currentWordIndex]}
    </span>
  );
};

export default AnimatedText;
