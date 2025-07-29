import React from 'react';
import { X } from 'lucide-react';
import FlashCardSession from './FlashCardSession';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSession: LearningSession | null;
  handleSessionAnswer: (isCorrect: boolean) => void;
}

export default function LearningSessionDialog({
  open,
  onOpenChange,
  currentSession,
  handleSessionAnswer,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-auto p-6">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
            Sesi Belajar:{' '}
            {currentSession?.mode
              ? currentSession.mode.charAt(0).toUpperCase() +
                currentSession.mode.slice(1)
              : 'Tidak Diketahui'}
          </DialogTitle>

          <DialogClose asChild>
            <button
              aria-label="Close"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
            >
              <X className="h-6 w-6" />
            </button>
          </DialogClose>
        </DialogHeader>

        {/* Conditional Mode Rendering */}
        {currentSession?.mode === 'flashcard' ? (
          <FlashCardSession
            currentSession={currentSession}
            handleSessionAnswer={handleSessionAnswer}
          />
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">
            Mode pembelajaran ini belum tersedia.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
