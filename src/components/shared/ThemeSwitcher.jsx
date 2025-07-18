import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon } from 'react-icons/fi';

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className="p-3 rounded-full border border-none transition duration-300 text-xl"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <FiSun className="text-yellow-400" />
      ) : (
        <FiMoon className="text-black" />
      )}
    </button>
  );
};
