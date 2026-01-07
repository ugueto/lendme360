import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-main text-[#ffffff] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              LendMe360
            </Link>
          </div>
          <div>
            <Link
              href="/login"
              className="bg-secondary text-[#000000] px-6 py-2 rounded-lg font-semibold hover:bg-tertiary transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
