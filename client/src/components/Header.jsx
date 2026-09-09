import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  
  // LocalStorage se check karega ki pehle dark mode on tha ya nahi
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className='bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200'>
      <div className='flex justify-between items-center max-w-7xl mx-auto px-6 py-4'>
        {/* Logo */}
        <Link to='/'>
          <h1 className='text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:opacity-90 transition-opacity'>
            HomeHorizon
          </h1>
        </Link>

        {/* Navigation Links */}
        <nav className='flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200'>
          <Link to='/' className='text-blue-600 dark:text-blue-400 font-semibold'>
            Home
          </Link>
          <Link to='/search' className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
            All Properties
          </Link>

          {currentUser ? (
            <Link to='/profile' className='flex items-center gap-2'>
              <img
                className='rounded-full h-8 w-8 object-cover border border-slate-200 dark:border-slate-700'
                src={currentUser.avatar}
                alt='profile'
              />
            </Link>
          ) : (
            <>
              <Link to='/sign-in' className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                Login
              </Link>
              <Link to='/sign-up' className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                Register
              </Link>
            </>
          )}

          {/* Working Dark Mode Toggle Button */}
          <button
            type='button'
            onClick={toggleTheme}
            className='p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-amber-400 transition-all cursor-pointer'
            title='Toggle Dark / Light Mode'
          >
            {darkMode ? <FaSun className='text-sm' /> : <FaMoon className='text-sm' />}
          </button>
        </nav>
      </div>
    </header>
  );
}