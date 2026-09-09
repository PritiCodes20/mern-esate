import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200'>
      <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl max-w-md w-full transition-all'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Welcome Back
          </h1>
          <p className='text-slate-500 dark:text-slate-400 text-sm mt-2'>
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5'>
              Email Address
            </label>
            <input
              type='email'
              placeholder='name@example.com'
              className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
              id='email'
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5'>
              Password
            </label>
            <input
              type='password'
              placeholder='••••••••'
              className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
              id='password'
              onChange={handleChange}
              required
            />
          </div>

          <button
            disabled={loading}
            className='bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-xl uppercase text-sm tracking-wider shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70 cursor-pointer mt-2'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <OAuth />
        </form>

        <div className='flex items-center justify-center gap-2 mt-6 text-sm text-slate-600 dark:text-slate-400'>
          <p>Don't have an account?</p>
          <Link to='/sign-up' className='text-blue-600 dark:text-blue-400 font-bold hover:underline'>
            Register
          </Link>
        </div>

        {error && <p className='text-red-500 text-xs text-center mt-4 font-semibold'>{error}</p>}
      </div>
    </div>
  );
}