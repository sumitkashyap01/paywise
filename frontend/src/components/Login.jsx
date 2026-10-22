import { useState } from 'react';

export default function Login({ onLoginSuccess, onSwitchToSignup }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      setErrorMessage('Please enter your username or email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate backend authentication request or connect to API
      await new Promise((resolve) => setTimeout(resolve, 600));

      const user = {
        identifier: trimmedIdentifier,
        displayName: trimmedIdentifier.includes('@')
          ? trimmedIdentifier.split('@')[0]
          : trimmedIdentifier,
        email: trimmedIdentifier.includes('@') ? trimmedIdentifier : `${trimmedIdentifier}@paywise.local`,
      };

      if (rememberMe) {
        localStorage.setItem('paywise_user', JSON.stringify(user));
      }

      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch {
      setErrorMessage('Invalid username/email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIdentifier('demo@paywise.com');
    setPassword('demopass123');
    setErrorMessage('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 text-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-black text-sm font-bold text-white shadow-xs">
            PW
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-1.5 text-xs text-neutral-500 sm:text-sm">
            Enter your username or email to access your PayWise account
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-neutral-300 bg-neutral-100 px-3.5 py-2.5 text-xs font-medium text-neutral-800"
              >
                {errorMessage}
              </div>
            )}

            {/* Username or Email field */}
            <div>
              <label
                htmlFor="login-identifier"
                className="mb-1 block text-xs font-semibold text-neutral-700"
              >
                Username or Email
              </label>
              <input
                id="login-identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com or username"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Password field with Show/Hide toggle */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-neutral-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link will be sent to your registered email.')}
                  className="text-xs text-neutral-500 transition-colors hover:text-black hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pr-10 pl-3.5 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 transition-colors hover:text-black"
                >
                  {showPassword ? (
                    // Eye Off icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 accent-black text-black focus:ring-black"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs text-neutral-600 select-none"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:bg-neutral-300"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Demo Credential quick-fill */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-700 transition-colors hover:border-black hover:bg-neutral-100 hover:text-black"
            >
              Fill Demo Credentials
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 border-t border-neutral-200 pt-5 text-center">
            <p className="text-xs text-neutral-500">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup || (() => alert('Sign up will be available soon.'))}
                className="font-medium text-black transition-colors hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
