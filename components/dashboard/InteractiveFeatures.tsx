'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { INTERACTIVE_FEATURES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';

const cardVariants = {
  hidden: { scale: 0.96, opacity: 0, y: 20 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12 + 0.3,
      duration: 0.35,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
  hover: {
    scale: 1.03,
    y: -6,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.97,
  },
};

export const InteractiveFeatures: React.FC = () => {
  const router = useRouter();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {INTERACTIVE_FEATURES.map((feature, index) => (
        <motion.div
          key={feature.slug}
          role="button"
          tabIndex={0}
          aria-label={`Open feature ${feature.title}`}
          onClick={() => router.push(`/features/${feature.slug}`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') router.push(`/features/${feature.slug}`);
          }}
          className={clsx(
            'relative text-white rounded-xl lg:rounded-2xl p-4 lg:p-6 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 transition-all group'
          )}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          custom={index}
        >
          {/* 🔍 Background image with zoom effect */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              className=" border object-cover opacity-20 group-hover:opacity-100 transition-opacity duration-300 rounded-xl lg:rounded-1xl"
              priority
            />
          </motion.div>

          {/* 🔤 Text & content */}
          <div className="relative z-10">
            <div className="text-xs bg-[#bb4114] inline-block px-2 py-1 rounded mb-3 lg:mb-4 font-medium shadow">
              INTERACTIVE
            </div>

            <h3 className="text-lg lg:text-xl font-bold mb-2">{feature.title}</h3>

            <p className="text-sm mb-3 lg:mb-4 opacity-90 leading-relaxed">
              {feature.description}
            </p>

            <div className="text-xs opacity-80 mb-3 lg:mb-4">{feature.type}</div>

            <motion.button
              className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 hover:bg-[#bb4114] transition-colors backdrop-blur-sm rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              aria-label="Play Feature"
              onClick={(e) => {
                e.stopPropagation(); // prevent parent routing
                router.push(`/features/${feature.slug}`);
              }}
            >
              <Play className="w-4 h-4 lg:w-5 lg:h-5  text-white" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </section>
  );
};
