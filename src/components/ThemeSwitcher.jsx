// src/components/ThemeSwitcher.jsx

import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher = () => {
  const {  toggleTheme } = useTheme();

  const handleClick = () => {
    console.log("Button clicked!"); // 👈 ADD THIS LINE
    toggleTheme();
  };

  return (
    <button onClick={handleClick}>
      Switch Theme
    </button>
  );
};