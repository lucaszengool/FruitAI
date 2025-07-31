'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useAuth, useUser } from '@clerk/nextjs';
import { User, LogIn, UserPlus, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';

export function UserMenu() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">
          Welcome, {user?.firstName || 'User'}!
        </span>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "shadow-2xl",
            }
          }}
          afterSignOutUrl="/"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white/90 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <User className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700 hidden sm:block">Account</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 min-w-48"
            >
              <div className="p-2 space-y-1">
                <SignUpButton mode="modal">
                  <motion.button
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-emerald-50 rounded-md transition-colors group"
                    whileHover={{ backgroundColor: '#f0fdf4' }}
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-medium text-gray-700 group-hover:text-emerald-700">Sign Up</p>
                      <p className="text-xs text-gray-500">Get unlimited scans</p>
                    </div>
                  </motion.button>
                </SignUpButton>
                
                <SignInButton mode="modal">
                  <motion.button
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-700">Sign In</span>
                  </motion.button>
                </SignInButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}