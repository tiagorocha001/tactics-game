import { useState } from 'react';

export const useIsMovementPossible = () => {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState('light');

  const incrementCount = () => setCount(prevCount => prevCount + 1);
  const decrementCount = () => setCount(prevCount => prevCount - 1);
  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  return {
    count,
    theme,
    incrementCount,
    decrementCount,
    toggleTheme
  };
}
