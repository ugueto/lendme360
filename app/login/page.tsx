'use client'

import { useState } from 'react'
import Link from 'next/link'

type AuthMode = 'signin' | 'signup'
type Role = 'user' | 'manager' | null

const ALLOWED_EMAIL_DOMAINS = ['lendable.com', 'lendable.co.uk']

function isValidLendableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return ALLOWED_EMAIL_DOMAINS.includes(domain)
}

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState<Role>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidLendableEmail(email)) {
      setError('Please use your Lendable email address (@lendable.com or @lendable.co.uk)')
      return
    }

    setIsLoading(true)
    // TODO: Implement Supabase sign in
    console.log('Sign in:', { email, password })
    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidLendableEmail(email)) {
      setError('Please use your Lendable email address (@lendable.com or @lendable.co.uk)')
      return
    }

    setIsLoading(true)
    // TODO: Implement Supabase sign up
    console.log('Sign up:', { firstName, lastName, email, password, role })
    setIsLoading(false)
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setRole(null)
    setError(null)
  }

  const switchMode = (newMode: AuthMode) => {
    resetForm()
    setMode(newMode)
  }

  return (
    <div className="min-h-screen bg-tertiary flex flex-col">
      {/* Header */}
      <div className="bg-main py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-[#ffffff] hover:opacity-80 transition-opacity">
            LendMe360
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-[#ffffff] rounded-lg shadow-xl max-w-md w-full p-8">
          {/* Tab Switcher */}
          <div className="flex mb-8 border-b border-gray-200">
            <button
              onClick={() => switchMode('signin')}
              className={`flex-1 py-3 text-center font-semibold transition-colors ${
                mode === 'signin'
                  ? 'text-main border-b-2 border-main'
                  : 'text-gray-500 hover:text-main'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-3 text-center font-semibold transition-colors ${
                mode === 'signup'
                  ? 'text-main border-b-2 border-main'
                  : 'text-gray-500 hover:text-main'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Email Domain Notice */}
          <div className="mb-6 p-3 bg-tertiary rounded-lg">
            <p className="text-sm text-main">
              Only Lendable employees can access this tool. Please use your @lendable.com or @lendable.co.uk email.
            </p>
          </div>

          {/* Sign In Form */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn}>
              <div className="mb-4">
                <label htmlFor="signin-email" className="block text-sm font-medium text-[#000000] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="signin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000]"
                  placeholder="you@lendable.co.uk"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="signin-password" className="block text-sm font-medium text-[#000000] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="signin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000]"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-main text-[#ffffff] py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-main font-semibold hover:underline"
                >
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* Create Account Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-[#000000] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000]"
                    placeholder="Jane"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-[#000000] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000]"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="signup-email" className="block text-sm font-medium text-[#000000] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="signup-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000]"
                  placeholder="jane.doe@lendable.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="signup-password" className="block text-sm font-medium text-[#000000] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="signup-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000]"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#000000] mb-3">
                  I am a:
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                      role === 'user'
                        ? 'bg-main text-[#ffffff]'
                        : 'bg-tertiary text-[#000000] hover:bg-secondary'
                    }`}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('manager')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                      role === 'manager'
                        ? 'bg-main text-[#ffffff]'
                        : 'bg-tertiary text-[#000000] hover:bg-secondary'
                    }`}
                  >
                    Manager
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !role}
                className={`w-full py-3 rounded-lg font-semibold transition-opacity ${
                  role
                    ? 'bg-main text-[#ffffff] hover:opacity-90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-main font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
