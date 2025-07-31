'use client';

import { motion } from 'framer-motion';
import { SignUpButton, SignInButton } from '@clerk/nextjs';
import { X, Sparkles, Zap, Target } from 'lucide-react';
import { Button } from './ui/Button';
import { useTranslation } from '../contexts/TranslationContext';

interface SignUpPromptProps {
  isOpen: boolean;
  onClose: () => void;
  remainingScans: number;
  totalScans: number;
}

export function SignUpPrompt({ isOpen, onClose, remainingScans, totalScans }: SignUpPromptProps) {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {remainingScans > 0 ? t('unlockMoreScans') : t('freeScansUsedUp')}
          </h2>
          <p className="text-gray-600">
            {remainingScans > 0 
              ? t('remainingScansMessage').replace('{count}', remainingScans.toString())
              : t('freeScansUsedMessage').replace('{count}', totalScans.toString())
            }
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-gray-700">{t('unlimitedScans')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-gray-700">{t('detailedNutrition')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-gray-700">{t('personalHistory')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <SignUpButton mode="modal">
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold">
              {t('signUpFree')}
            </Button>
          </SignUpButton>
          
          <SignInButton mode="modal">
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 py-3 rounded-xl">
              {t('alreadyHaveAccount')}
            </Button>
          </SignInButton>
        </div>

        {remainingScans > 0 && (
          <button
            onClick={onClose}
            className="w-full mt-3 text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            {t('continueWithFreeScans').replace('{count}', remainingScans.toString())}
          </button>
        )}
      </motion.div>
    </div>
  );
}