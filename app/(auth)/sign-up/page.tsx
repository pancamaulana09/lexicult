    'use client';

    import { SignUp } from '@clerk/nextjs';
    import { dark } from '@clerk/themes';
    import { useTheme } from '@/hooks/useTheme';
    import { motion, AnimatePresence } from 'framer-motion';
    import Head from 'next/head';
    import { useRouter } from 'next/navigation';
    import { useEffect, useState } from 'react';
    import { Loader2, ArrowLeft, CheckCircle, Users, BookOpen, Trophy } from 'lucide-react';

    interface SignupPageProps {
    redirectUrl?: string;
    }

    export default function SignupPage({ redirectUrl = '/dashboard' }: SignupPageProps) {
    const { isDarkMode } = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleBackToHome = () => {
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

    const featureVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
            duration: 0.5,
            delay: 0.2
        }
        }
    };

    const features = [
        {
        icon: BookOpen,
        title: 'Personalized Learning',
        description: 'AI-powered curriculum tailored to your pace and style'
        },
        {
        icon: Users,
        title: 'Community Support',
        description: 'Connect with learners and mentors worldwide'
        },
        {
        icon: Trophy,
        title: 'Track Progress',
        description: 'Monitor your growth with detailed analytics'
        }
    ];

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
            <title>Sign Up | Lexicult</title>
            <meta 
            name="description" 
            content="Create your Lexicult account and start your personalized learning journey today. Join thousands of learners worldwide." 
            />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="keywords" content="signup, register, learning, education, Lexicult" />
            <link rel="canonical" href="/register" />
        </Head>

        <AnimatePresence mode="wait">
            <motion.div
            className="min-h-screen flex bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] dark:from-[#0D1117] dark:via-[#161b22] dark:to-[#1c2128] relative overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                />
                <motion.div
                className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                />
                <motion.div
                className="absolute -bottom-40 right-10 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.2, 0.4],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                />
            </div>

            {/* Left side - Features */}
            <motion.aside 
                className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center p-12"
                variants={itemVariants}
            >
                <motion.div 
                className="max-w-lg"
                variants={featureVariants}
                >
                <motion.h1 
                    className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight"
                    variants={itemVariants}
                >
                    Start Your Learning
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {' '}Journey
                    </span>
                </motion.h1>
                
                <motion.p 
                    className="text-slate-300 text-lg mb-8 leading-relaxed"
                    variants={itemVariants}
                >
                    Join thousands of learners who are already transforming their skills with our personalized learning platform.
                </motion.p>

                <motion.div 
                    className="space-y-6"
                    variants={itemVariants}
                >
                    {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        className="flex items-start gap-4 group"
                        variants={itemVariants}
                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                        <feature.icon className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                        </div>
                        <div>
                        <h3 className="text-white font-semibold mb-1 group-hover:text-blue-100 transition-colors duration-300">
                            {feature.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                        </div>
                    </motion.div>
                    ))}
                </motion.div>

                <motion.div 
                    className="mt-8 pt-8 border-t border-slate-700/50"
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Free to start • No credit card required</span>
                    </div>
                </motion.div>
                </motion.div>
            </motion.aside>

            {/* Right side - Signup form */}
            <motion.main 
                className="w-full lg:w-1/2 flex flex-col relative z-10"
                variants={itemVariants}
            >
                {/* Header */}
                <motion.header 
                className="p-6"
                variants={itemVariants}
                >
                <button
                    onClick={handleBackToHome}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 group"
                    aria-label="Back to home"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="text-sm font-medium">Back to Lexicult</span>
                </button>
                </motion.header>

                {/* Form section */}
                <div className="flex-1 flex items-center justify-center px-6 py-8">
                <motion.section
                    className="w-full max-w-md"
                    variants={itemVariants}
                    aria-label="Create your account"
                >
                    {/* Welcome text - Mobile only */}
                    <motion.div 
                    className="text-center mb-8 lg:hidden"
                    variants={itemVariants}
                    >
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Join Lexicult
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Start your personalized learning journey
                    </p>
                    </motion.div>

                    {/* Desktop welcome text */}
                    <motion.div 
                    className="hidden lg:block text-center mb-8"
                    variants={itemVariants}
                    >
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Create Account
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Fill in your details to get started
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
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 p-[1px]">
                        <div className="h-full w-full rounded-2xl bg-slate-900/80 dark:bg-black/80" />
                    </div>

                    <div className="relative p-8">
                        {isLoading && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl z-50">
                            <div className="flex items-center gap-3 text-white">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm">Creating your account...</span>
                            </div>
                        </div>
                        )}

                        <SignUp
                        appearance={{
                            baseTheme: isDarkMode ? dark : undefined,
                            variables: {
                            colorPrimary: '#8b5cf6',
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
                                'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 transition-all duration-200 shadow-lg hover:shadow-purple-500/25',
                            formFieldInput: 
                                'bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all duration-200',
                            formFieldLabel: 'text-slate-300 font-medium text-sm',
                            identityPreviewText: 'text-slate-300',
                            identityPreviewEditButton: 'text-purple-400 hover:text-purple-300',
                            footerActionText: 'text-slate-400',
                            footerActionLink: 'text-purple-400 hover:text-purple-300 font-medium',
                            dividerLine: 'bg-slate-700/50',
                            dividerText: 'text-slate-400 text-xs',
                            otpCodeFieldInput: 
                                'bg-slate-800/50 border-slate-700/50 text-white focus:border-purple-500',
                            alertText: 'text-red-400 text-sm',
                            formResendCodeLink: 'text-purple-400 hover:text-purple-300',
                            phoneInputBox: 'bg-slate-800/50 border-slate-700/50 text-white',
                            formFieldSuccessText: 'text-green-400 text-sm',
                            formFieldWarningText: 'text-yellow-400 text-sm',
                            },
                        }}
                        routing="path"
                        path="/register"
                        signInUrl="/login"
                        redirectUrl={redirectUrl}
                        afterSignUpUrl={redirectUrl}
                        onStatusChange={(status) => {
                            setIsLoading(status === 'loading');
                        }}
                        />
                    </div>
                    </motion.div>

                    {/* Terms and Privacy */}
                    <motion.div 
                    className="text-center mt-6"
                    variants={itemVariants}
                    >
                    <p className="text-slate-400 text-xs leading-relaxed">
                        By signing up, you agree to our{' '}
                        <a 
                        href="/terms" 
                        className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200"
                        >
                        Terms of Service
                        </a>
                        {' '}and{' '}
                        <a 
                        href="/privacy" 
                        className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200"
                        >
                        Privacy Policy
                        </a>
                    </p>
                    </motion.div>
                </motion.section>
                </div>

                {/* Footer */}
                <motion.footer 
                className="p-6 text-center"
                variants={itemVariants}
                >
                <p className="text-slate-500 text-xs">
                    © 2024 Lexicult. All rights reserved.
                </p>
                </motion.footer>
            </motion.main>
            </motion.div>
        </AnimatePresence>
        </>
    );
    }