import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('shikhon_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('shikhon_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Luxury high-performance theme toggle animation:
  // Uses native View Transition API (Circular Ripple Reveal from click position) on modern browsers (Chrome/Safari 18+/Edge),
  // with a silky 300ms color-fade fallback that never touches layout properties to prevent mobile lag.
  const toggleTheme = (e) => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';

    // 1. Native View Transition API (Ripple Reveal)
    if (
      typeof document !== 'undefined' &&
      typeof document.startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      let x = window.innerWidth / 2;
      let y = 40;

      if (e && e.clientX !== undefined && e.clientX !== 0) {
        x = e.clientX;
        y = e.clientY;
      } else if (e && e.currentTarget) {
        const rect = e.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        setTheme(nextTheme);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];

        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 420,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
      return;
    }

    // 2. Silky Color Fade Transition Fallback (300ms)
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    setTheme(nextTheme);

    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 350);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
