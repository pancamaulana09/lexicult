import React, { useState } from 'react';

interface Props {
  currentSession: LearningSession;
  handleSessionAnswer: (isCorrect: boolean) => void;
}

export default function FlashCardSession({ currentSession, handleSessionAnswer }: Props) {
  const [showAnswer, setShowAnswer] = useState(false);

  const word = currentSession.words[currentSession.currentIndex];
  if (!word) return null;

  return (
    <div className="text-center space-y-6">
      <div className="text-sm text-slate-500 mb-4">
        {currentSession.currentIndex + 1} dari {currentSession.totalWords}
      </div>

      <div
        className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 cursor-pointer transition-transform hover:scale-105"
        onClick={() => setShowAnswer(!showAnswer)}
      >
        <div className="flex items-center justify-center h-full">
          {!showAnswer ? (
            <div className="text-center text-white">
              <h3 className="text-4xl font-bold mb-4">{word.word}</h3>
              <p className="text-blue-100 mb-2">{word.pronunciation}</p>
              <span className="bg-white/20 text-white px-2 py-1 rounded inline-block">{word.partOfSpeech}</span>
            </div>
          ) : (
            <div className="text-center text-white">
              <h3 className="text-3xl font-bold mb-4">{word.translation}</h3>
              <p className="text-blue-100 text-lg mb-4">{word.definition}</p>
              <div className="text-sm text-blue-100">{word.examples[0]}</div>
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <p className="text-white/70 text-sm">{showAnswer ? 'Klik untuk melihat kata' : 'Klik untuk melihat arti'}</p>
        </div>
      </div>

      {showAnswer && (
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              handleSessionAnswer(false);
              setShowAnswer(false);
            }}
            className="flex-1 max-w-32 border border-gray-300 rounded px-4 py-2"
          >
            Sulit
          </button>
          <button
            onClick={() => {
              handleSessionAnswer(true);
              setShowAnswer(false);
            }}
            className="flex-1 max-w-32 bg-blue-600 text-white rounded px-4 py-2"
          >
            Mudah
          </button>
        </div>
      )}
    </div>
  );
}
