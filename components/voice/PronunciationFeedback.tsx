'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Volume2, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  BookOpen,
  Lightbulb,
  Award
} from 'lucide-react';

interface PronunciationScore {
  overall: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  prosody: number;
}

interface WordFeedback {
  word: string;
  score: number;
  phonemes: PhonemeScore[];
  suggestions: string[];
  isCorrect: boolean;
}

interface PhonemeScore {
  phoneme: string;
  score: number;
  expected: string;
  actual: string;
}

interface PronunciationFeedbackProps {
  audioBlob?: Blob;
  targetText?: string;
  referenceAudio?: string;
  onRetry?: () => void;
  onPlayReference?: () => void;
  isDarkMode?: boolean;
  themeClasses?: any;
  showDetailedFeedback?: boolean;
}

export function PronunciationFeedback({
  audioBlob,
  targetText = "Hello, how are you today?",
  referenceAudio,
  onRetry,
  onPlayReference,
  isDarkMode = false,
  themeClasses,
  showDetailedFeedback = true
}: PronunciationFeedbackProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scores, setScores] = useState<PronunciationScore>({
    overall: 0,
    accuracy: 78,
    fluency: 85,
    completeness: 92,
    prosody: 71
  });
  
  const [wordFeedback, setWordFeedback] = useState<WordFeedback[]>([
    {
      word: "Hello",
      score: 95,
      phonemes: [
        { phoneme: "h", score: 98, expected: "/h/", actual: "/h/" },
        { phoneme: "e", score: 92, expected: "/ə/", actual: "/e/" },
        { phoneme: "lo", score: 96, expected: "/loʊ/", actual: "/loʊ/" }
      ],
      suggestions: ["Great pronunciation!"],
      isCorrect: true
    },
    {
      word: "how",
      score: 71,
      phonemes: [
        { phoneme: "h", score: 85, expected: "/h/", actual: "/h/" },
        { phoneme: "ow", score: 65, expected: "/aʊ/", actual: "/oʊ/" }
      ],
      suggestions: ["Try making the 'ow' sound more like 'ou' in 'house'"],
      isCorrect: false
    },
    {
      word: "are",
      score: 88,
      phonemes: [
        { phoneme: "ar", score: 88, expected: "/ɑr/", actual: "/ɑr/" }
      ],
      suggestions: ["Good rhythm!"],
      isCorrect: true
    },
    {
      word: "you",
      score: 82,
      phonemes: [
        { phoneme: "y", score: 90, expected: "/j/", actual: "/j/" },
        { phoneme: "ou", score: 75, expected: "/u/", actual: "/ʊ/" }
      ],
      suggestions: ["Make the 'ou' sound longer and clearer"],
      isCorrect: true
    },
    {
      word: "today",
      score: 69,
      phonemes: [
        { phoneme: "to", score: 80, expected: "/tə/", actual: "/tʊ/" },
        { phoneme: "day", score: 58, expected: "/deɪ/", actual: "/deː/" }
      ],
      suggestions: ["Emphasize the 'day' part more", "Make sure to pronounce the 'ay' as in 'play'"],
      isCorrect: false
    }
  ]);

  const [practiceMode, setPracticeMode] = useState<'word' | 'sentence'>('sentence');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Simulate analysis when audio is provided
  useEffect(() => {
    if (audioBlob) {
      setIsAnalyzing(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Calculate overall score
        const avgScore = wordFeedback.reduce((sum, word) => sum + word.score, 0) / wordFeedback.length;
        setScores(prev => ({
          ...prev,
          overall: Math.round(avgScore),
          accuracy: Math.round(avgScore * 0.9),
          fluency: Math.round(avgScore * 1.1),
          completeness: Math.round(avgScore * 1.15),
          prosody: Math.round(avgScore * 0.85)
        }));
        setIsAnalyzing(false);
      }, 2000);
    }
  }, [audioBlob]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 85) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 70) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getTrendIcon = (score: number) => {
    if (score >= 85) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (score >= 70) return <Minus className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  if (isAnalyzing) {
    return (
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Analyzing Your Pronunciation</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Please wait while we process your audio...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            Pronunciation Feedback
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant={getScoreBadgeVariant(scores.overall)} className="text-lg px-3 py-1">
              {scores.overall}%
            </Badge>
            {getScoreIcon(scores.overall)}
          </div>
        </div>

        {/* Target Text */}
        <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium">Target Text:</span>
          </div>
          <p className="text-lg leading-relaxed">{targetText}</p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className={`text-2xl font-bold ${getScoreColor(scores.accuracy)}`}>
                {scores.accuracy}%
              </span>
              {getTrendIcon(scores.accuracy)}
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</p>
            <Progress value={scores.accuracy} className="h-2 mt-2" />
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className={`text-2xl font-bold ${getScoreColor(scores.fluency)}`}>
                {scores.fluency}%
              </span>
              {getTrendIcon(scores.fluency)}
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fluency</p>
            <Progress value={scores.fluency} className="h-2 mt-2" />
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className={`text-2xl font-bold ${getScoreColor(scores.completeness)}`}>
                {scores.completeness}%
              </span>
              {getTrendIcon(scores.completeness)}
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completeness</p>
            <Progress value={scores.completeness} className="h-2 mt-2" />
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className={`text-2xl font-bold ${getScoreColor(scores.prosody)}`}>
                {scores.prosody}%
              </span>
              {getTrendIcon(scores.prosody)}
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prosody</p>
            <Progress value={scores.prosody} className="h-2 mt-2" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          {referenceAudio && (
            <Button variant="outline" onClick={onPlayReference} className="gap-2">
              <Volume2 className="w-4 h-4" />
              Play Reference
            </Button>
          )}
          <Button onClick={onRetry} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </Card>

      {/* Detailed Word Feedback */}
      {showDetailedFeedback && (
        <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Detailed Feedback
          </h4>

          {/* Practice Mode Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Practice Mode:
            </span>
            <Button
              variant={practiceMode === 'sentence' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPracticeMode('sentence')}
            >
              Sentence
            </Button>
            <Button
              variant={practiceMode === 'word' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPracticeMode('word')}
            >
              Word by Word
            </Button>
          </div>

          {/* Word-by-word Analysis */}
          <div className="space-y-4">
            {wordFeedback.map((word, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  word.isCorrect 
                    ? isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                    : isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
                } ${practiceMode === 'word' && currentWordIndex === index ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">{word.word}</span>
                    <Badge variant={getScoreBadgeVariant(word.score)}>
                      {word.score}%
                    </Badge>
                    {word.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentWordIndex(index)}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Phoneme Breakdown */}
                <div className="mb-3">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phoneme Analysis:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {word.phonemes.map((phoneme, pIndex) => (
                      <div 
                        key={pIndex}
                        className={`px-2 py-1 rounded text-xs font-mono ${
                          phoneme.score >= 85 
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : phoneme.score >= 70
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        <div className="font-bold">{phoneme.phoneme}</div>
                        <div className="text-xs opacity-75">
                          {phoneme.expected} → {phoneme.actual}
                        </div>
                        <div className="text-xs">{phoneme.score}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                {word.suggestions.length > 0 && (
                  <div>
                    <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Suggestions:
                    </p>
                    <ul className="space-y-1">
                      {word.suggestions.map((suggestion, sIndex) => (
                        <li 
                          key={sIndex}
                          className={`text-sm flex items-start gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                          <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Overall Recommendations */}
          <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-blue-600" />
              <h5 className="font-semibold text-blue-600">Improvement Recommendations</h5>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                Focus on the 'ow' sound in "how" - try making it sound more like the 'ou' in "house"
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                Work on stress patterns - emphasize the second syllable in "today"
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                Practice connecting words smoothly to improve fluency
              </li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}