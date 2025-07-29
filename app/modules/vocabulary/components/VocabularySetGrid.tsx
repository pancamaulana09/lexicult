import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import VocabularySetCard from './VocabularySetCard';

interface Props {
  vocabularySets: VocabularySet[];
  startLearningSession: (setId: string, mode: string) => void;
}

export default function VocabularySetGrid({ vocabularySets, startLearningSession }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence>
        {vocabularySets.map((set, index) => (
          <motion.div
            key={set.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <VocabularySetCard vocabularySet={set} startLearningSession={startLearningSession} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
