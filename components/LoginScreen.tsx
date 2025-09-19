import React, { useState, useCallback } from 'react';
import { LockIcon, MailIcon, UserIcon } from './icons';

interface LoginScreenProps {
  onLoginSuccess: (username: string, password: string) => boolean;
  onSignup: (username: string, email: string, password: string) => { success: boolean, message?: string };
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const toggleView = useCallback(() => {
    setIsLoginView(prev => !prev);
    setError('');
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginView) {
      if (!onLoginSuccess(username, password)) {
        setError('Invalid username or password.');
      }
    } else {
      // Sign-up logic
      if (username.trim().length < 3) {
        setError('Username must be at least 3 characters long.');
        return;
      }
      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      
      const result = onSignup(username, email, password);
      if (!result.success) {
        setError(result.message || 'An unknown error occurred during signup.');
      }
      // If signup is successful, the parent component will handle the state change
      // and this component will be unmounted. No success message is needed here.
    }
  }, [username, password, email, confirmPassword, isLoginView, onLoginSuccess, onSignup]);

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#F22EE5] via-[#85F3FF] to-[#174B80] dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex flex-col justify-center items-center p-6 text-white transition-all duration-500">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ textShadow: '3px 3px 0 #000' }}
          >
            Welcome to editing_wo_rld_ App
          </h1>
          <p className="text-white/80">{isLoginView ? 'Sign in to continue' : 'Create an account to get started'}</p>
        </div>

        {error && (
            <div className="bg-red-500/50 text-white text-sm font-semibold p-3 rounded-lg mb-4 text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 dark:bg-gray-800/60 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              required
            />
          </div>
          {!isLoginView && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 dark:bg-gray-800/60 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                required
              />
            </div>
          )}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 dark:bg-gray-800/60 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              required
            />
          </div>
          {!isLoginView && (
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 dark:bg-gray-800/60 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                required
              />
            </div>
          )}

          <button type="submit" className="w-full bg-white text-[#174B80] dark:bg-purple-500 dark:text-white font-bold py-3 rounded-lg shadow-lg hover:bg-gray-200 dark:hover:bg-purple-400 transition transform hover:-translate-y-0.5">
            {isLoginView ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={toggleView} className="text-white/80 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 transition">
            {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
