'use client';

import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from '@/hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  redirectUrl?: string;
}

export default function LoginPage({ redirectUrl = '/' }: LoginPageProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleBackToDashboard = () => {
    router.push('/');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In | Lexicult</title>
        <meta
          name="description"
          content="Sign in to your Lexicult account to access personalized learning tools and track your progress."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="/login" />
      </Head>

      <AnimatePresence mode="wait">
        <motion.div
          className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          {/* 🎨 Grid Texture Background Mask */}
          <div className="absolute inset-0 bg-white dark:bg-black">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          </div>

          {/* 💠 Animated Header */}
          <motion.header className="relative z-10 w-full max-w-md mb-6" variants={itemVariants}>
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Lexicult</span>
            </button>
          </motion.header>

          {/* 🔐 Auth Section */}
          <motion.section className="relative z-10 w-full max-w-md" variants={itemVariants}>
            <motion.div className="text-center mb-6" variants={itemVariants}>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Welcome back</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to continue your learning journey</p>
            </motion.div>

            <motion.div
              className="relative rounded-2xl backdrop-blur-xl border border-slate-200/10 dark:border-slate-800/50 bg-white/10 dark:bg-black/20 overflow-hidden shadow-2xl"
              variants={itemVariants}
            >
              {/* 🔄 Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center">
                  <div className="flex items-center gap-3 text-white">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">Signing you in...</span>
                  </div>
                </div>
              )}

              <div className="relative p-6 z-10">
                <SignIn
                  appearance={{
                    baseTheme: isDarkMode ? dark : undefined,
                    variables: {
                      colorPrimary: '#3b82f6',
                      colorBackground: 'transparent',
                      colorInputBackground: 'rgba(30, 41, 59, 0.5)',
                      colorInputText: '#ffffff',
                      colorText: '#e2e8f0',
                      colorTextSecondary: '#94a3b8',
                      borderRadius: '0.75rem',
                    },
                    elements: {
                      card: 'shadow-none bg-transparent border-none',
                      headerTitle: 'text-white text-xl font-semibold',
                      headerSubtitle: 'text-slate-400 text-sm',
                      formButtonPrimary:
                        'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 shadow-lg',
                      formFieldInput:
                        'bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50',
                      formFieldLabel: 'text-slate-300 font-medium text-sm',
                      socialButtonsBlockButton:
                        'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 text-white',
                      footerActionLink: 'text-blue-400 hover:text-blue-300 font-medium',
                      dividerLine: 'bg-slate-700/50',
                    },
                  }}
                  routing="path"
                  path="/login"
                  signUpUrl="/register"
                  redirectUrl={redirectUrl}
                  afterSignInUrl={redirectUrl}
                  onStatusChange={(status) => setIsLoading(status === 'loading')}
                />
              </div>
            </motion.div>

            <motion.p className="text-center text-xs text-slate-400 mt-6" variants={itemVariants}>
              Need help?{' '}
              <a href="/support" className="text-blue-400 hover:text-blue-300 underline">
                Contact support
              </a>
            </motion.p>
          </motion.section>

          {/* 🧾 Footer */}
          <motion.footer className="relative z-10 text-center mt-8 text-slate-500 text-xs" variants={itemVariants}>
            © 2024 Lexicult. All rights reserved.
          </motion.footer>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
