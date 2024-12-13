'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const isActivePath = (path) => pathname === path;

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Get Me A Chai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!loading && (
              <>
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`text-gray-600 hover:text-orange-600 transition-colors ${
                        isActivePath('/dashboard') ? 'font-semibold text-orange-600' : ''
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/explore"
                      className={`text-gray-600 hover:text-orange-600 transition-colors ${
                        isActivePath('/explore') ? 'font-semibold text-orange-600' : ''
                      }`}
                    >
                      Explore
                    </Link>
                    
                    {/* Profile Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center space-x-2 focus:outline-none"
                      >
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          {session.user?.image ? (
                            <Image
                              src={session.user.image}
                              alt="Profile"
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <span className="text-orange-600 font-semibold">
                              {session.user?.name?.[0] || 'U'}
                            </span>
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {showProfileMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                          >
                            <Link
                              href="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                            >
                              Your Profile
                            </Link>
                            <Link
                              href="/settings"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                            >
                              Settings
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                            >
                              Sign Out
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-between">
              <span className={`block w-6 h-0.5 bg-gray-600 transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`block w-6 h-0.5 bg-gray-600 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-gray-600 transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {!loading && session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActivePath('/dashboard')
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/explore"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActivePath('/explore')
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      Explore
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-orange-600 to-yellow-500 text-white hover:opacity-90"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
