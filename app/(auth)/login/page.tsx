'use client';

import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from '@/hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  redirectUrl?: string;
}

export default function LoginPage({ redirectUrl = '/' }: LoginPageProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBackToDashboard = () => {
    router.push('/');
  };

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
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
          className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] dark:from-[#0D1117] dark:via-[#161b22] dark:to-[#1c2128] relative overflow-hidden"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Header */}
          <motion.header 
            className="relative z-10 p-6"
            variants={itemVariants}
          >
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 group"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back to Lexicult</span>
            </button>
          </motion.header>

          {/* Main content */}
          <motion.main
            className="flex-1 flex items-center justify-center px-4 py-8 relative z-10"
            variants={itemVariants}
          >
            <motion.section
              className="w-full max-w-md"
              variants={itemVariants}
              aria-label="Sign in to your account"
            >
              {/* Welcome text */}
              <motion.div 
                className="text-center mb-8"
                variants={itemVariants}
              >
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back
                </h1>
                <p className="text-slate-400 text-sm">
                  Sign in to continue your learning journey
                </p>
              </motion.div>

              {/* Auth card */}
              <motion.div
                className="relative backdrop-blur-xl border border-slate-200/10 dark:border-slate-800/50 bg-white/5 dark:bg-black/20 rounded-2xl shadow-2xl overflow-hidden"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 p-[1px]">
                  <div className="h-full w-full rounded-2xl bg-slate-900/80 dark:bg-black/80" />
                </div>

                <div className="relative p-8">
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl z-50">
                      <div className="flex items-center gap-3 text-white">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm">Signing you in...</span>
                      </div>
                    </div>
                  )}

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
                        socialButtonsBlockButton: 
                          'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 text-white transition-all duration-200',
                        socialButtonsBlockButtonText: 'text-white font-medium',
                        formButtonPrimary: 
                          'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 transition-all duration-200 shadow-lg hover:shadow-blue-500/25',
                        formFieldInput: 
                          'bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200',
                        formFieldLabel: 'text-slate-300 font-medium text-sm',
                        identityPreviewText: 'text-slate-300',
                        identityPreviewEditButton: 'text-blue-400 hover:text-blue-300',
                        footerActionText: 'text-slate-400',
                        footerActionLink: 'text-blue-400 hover:text-blue-300 font-medium',
                        dividerLine: 'bg-slate-700/50',
                        dividerText: 'text-slate-400 text-xs',
                        otpCodeFieldInput: 
                          'bg-slate-800/50 border-slate-700/50 text-white focus:border-blue-500',
                        alertText: 'text-red-400 text-sm',
                        formResendCodeLink: 'text-blue-400 hover:text-blue-300',
                      },
                    }}
                    routing="path"
                    path="/login"
                    signUpUrl="/register"
                    redirectUrl={redirectUrl}
                    afterSignInUrl={redirectUrl}
                    onStatusChange={(status) => {
                      setIsLoading(status === 'loading');
                    }}
                  />
                </div>
              </motion.div>

              {/* Additional help text */}
              <motion.div 
                className="text-center mt-6"
                variants={itemVariants}
              >
                <p className="text-slate-400 text-xs">
                  Having trouble? Contact our{' '}
                  <a 
                    href="/support" 
                    className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                  >
                    support team
                  </a>
                </p>
              </motion.div>
            </motion.section>
          </motion.main>

          {/* Footer */}
          <motion.footer 
            className="relative z-10 p-6 text-center"
            variants={itemVariants}
          >
            <p className="text-slate-500 text-xs">
              © 2024 Lexicult. All rights reserved.
            </p>
          </motion.footer>
        </motion.div>
      </AnimatePresence>
    </>
  );
}