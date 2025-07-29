'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle, Star, Clock, Users, Target, Award, ArrowRight, Volume2, RefreshCw, Brain, Zap, Globe, Eye, Headphones } from 'lucide-react';

// Mock data for vocabulary modules
const vocabularyModules = {
  A1: [
    {
      id: 1,
      title: "Basic Family & Relationships",
      description: "Learn essential vocabulary about family members and relationships",
      progress: 90,
      words: 45,
      learned: 41,
      difficulty: "Beginner",
      duration: "35 min",
      topics: ["Family members", "Relationships", "Age", "Appearance"],
      isUnlocked: true,
      category: "People"
    },
    {
      id: 2,
      title: "Daily Activities & Routines",
      description: "Master vocabulary for everyday activities and daily routines",
      progress: 75,
      words: 60,
      learned: 45,
      difficulty: "Beginner",
      duration: "45 min",
      topics: ["Morning routine", "Work activities", "Evening activities", "Hobbies"],
      isUnlocked: true,
      category: "Activities"
    },
    {
      id: 3,
      title: "Food & Drinks",
      description: "Essential vocabulary for food, drinks, and dining experiences",
      progress: 100,
      words: 80,
      learned: 80,
      difficulty: "Beginner",
      duration: "50 min",
      topics: ["Fruits", "Vegetables", "Beverages", "Meals", "Restaurant"],
      isUnlocked: true,
      category: "Food"
    },
    {
      id: 4,
      title: "Colors & Shapes",
      description: "Learn basic colors, shapes, and descriptive adjectives",
      progress: 0,
      words: 35,
      learned: 0,
      difficulty: "Beginner",
      duration: "25 min",
      topics: ["Primary colors", "Secondary colors", "Basic shapes", "Descriptions"],
      isUnlocked: false,
      category: "Descriptions"
    }
  ],
  A2: [
    {
      id: 5,
      title: "Travel & Transportation",
      description: "Vocabulary for traveling, transportation modes, and directions",
      progress: 60,
      words: 70,
      learned: 42,
      difficulty: "Elementary",
      duration: "55 min",
      topics: ["Transport modes", "Airport", "Hotel", "Directions", "Tourism"],
      isUnlocked: true,
      category: "Travel"
    },
    {
      id: 6,
      title: "Shopping & Money",
      description: "Essential vocabulary for shopping, money, and commercial transactions",
      progress: 40,
      words: 65,
      learned: 26,
      difficulty: "Elementary",
      duration: "60 min",
      topics: ["Clothing", "Prices", "Payment", "Store types", "Bargaining"],
      isUnlocked: true,
      category: "Commerce"
    }
  ],
  B1: [
    {
      id: 7,
      title: "Work & Professions",
      description: "Professional vocabulary for workplace and career discussions",
      progress: 30,
      words: 90,
      learned: 27,
      difficulty: "Intermediate",
      duration: "75 min",
      topics: ["Job titles", "Office equipment", "Meetings", "Skills", "Career"],
      isUnlocked: true,
      category: "Professional"
    }
  ],
  B2: [
    {
      id: 8,
      title: "Academic & Scientific Terms",
      description: "Advanced vocabulary for academic and scientific contexts",
      progress: 0,
      words: 120,
      learned: 0,
      difficulty: "Upper-Intermediate",
      duration: "90 min",
      topics: ["Research", "Analysis", "Methodology", "Theory", "Innovation"],
      isUnlocked: false,
      category: "Academic"
    }
  ]
};

const recentVocabActivity = [
  { module: "Food & Drinks", action: "Mastered", time: "1 hour ago", score: 100, wordsLearned: 15 },
  { module: "Travel & Transportation", action: "Practiced", time: "3 hours ago", score: 85, wordsLearned: 8 },
  { module: "Daily Activities", action: "Reviewed", time: "1 day ago", score: 92, wordsLearned: 12 }
];

const vocabularyAchievements = [
  { title: "Word Explorer", description: "Learn your first 50 vocabulary words", earned: true, icon: Globe },
  { title: "Daily Learner", description: "Practice vocabulary for 7 days straight", earned: false, icon: Zap },
  { title: "Vocabulary Master", description: "Master 5 complete vocabulary modules", earned: true, icon: Brain },
  { title: "Perfect Recall", description: "Get 100% on a vocabulary quiz", earned: false, icon: Target }
];

// Simple Components
function ProgressBar({ value, className = "" }) {
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
      <div 
        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variants = {
    default: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

function Button({ children, onClick, disabled = false, variant = "default", className = "" }) {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
    ghost: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

function VocabularyModuleCard({ module, onStart }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800';
      case 'Elementary': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800';
      case 'Upper-Intermediate': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'People': return Users;
      case 'Activities': return Play;
      case 'Food': return '🍽️';
      case 'Travel': return Globe;
      case 'Commerce': return '💰';
      case 'Professional': return '💼';
      case 'Academic': return Brain;
      default: return BookOpen;
    }
  };

  const CategoryIcon = getCategoryIcon(module.category);

  return (
    <Card className={`p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 ${!module.isUnlocked ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              {typeof CategoryIcon === 'string' ? (
                <span className="text-2xl">{CategoryIcon}</span>
              ) : (
                <CategoryIcon className="w-6 h-6 text-green-500" />
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{module.title}</h3>
            </div>
            {module.progress === 100 && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-3">{module.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={getDifficultyColor(module.difficulty)}>
              {module.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {module.duration}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              {module.learned}/{module.words} words
            </Badge>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 dark:text-gray-300">Learning Progress</span>
              <span className="text-gray-700 dark:text-gray-300">{module.progress}%</span>
            </div>
            <ProgressBar value={module.progress} />
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Topics covered:</p>
            <div className="flex flex-wrap gap-1">
              {module.topics.map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          {module.progress === 100 ? (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Star className="w-4 h-4" />
              Mastered
            </span>
          ) : module.progress > 0 ? (
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Brain className="w-4 h-4" />
              Learning
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Not Started
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => console.log('Practice mode:', module.title)}
            disabled={!module.isUnlocked || module.progress === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Headphones className="w-4 h-4" />
            Practice
          </Button>
          <Button
            onClick={() => onStart(module)}
            disabled={!module.isUnlocked}
            className="flex items-center gap-2"
            variant={module.progress === 0 ? "default" : "outline"}
          >
            {module.progress === 0 ? 'Start Learning' : module.progress === 100 ? 'Review' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ActivityCard({ activity }) {
  const getActionColor = (action) => {
    switch (action) {
      case 'Mastered': return 'text-green-600 dark:text-green-400';
      case 'Practiced': return 'text-blue-600 dark:text-blue-400';
      case 'Reviewed': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{activity.module}</h4>
          <p className={`text-sm ${getActionColor(activity.action)}`}>{activity.action}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
          {activity.wordsLearned && (
            <p className="text-xs text-green-600 dark:text-green-400">+{activity.wordsLearned} new words</p>
          )}
        </div>
        {activity.score && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {activity.score}%
          </Badge>
        )}
      </div>
    </Card>
  );
}

function AchievementCard({ achievement }) {
  const IconComponent = achievement.icon;
  
  return (
    <Card className={`p-4 ${achievement.earned ? 'border-green-500/50 bg-green-50/20 dark:bg-green-900/10' : ''}`}>
      <div className="flex items-start gap-3">
        <IconComponent className={`w-6 h-6 ${achievement.earned ? 'text-green-500' : 'text-gray-400'}`} />
        <div>
          <h4 className={`font-medium ${achievement.earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {achievement.title}
          </h4>
          <p className={`text-sm ${achievement.earned ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
            {achievement.description}
          </p>
          {achievement.earned && (
            <Badge className="mt-2 bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
              Earned
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function VocabularyPage() {
  const [selectedLevel, setSelectedLevel] = useState('A1');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  // Initialize theme from system preference
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    
    const handleChange = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleChange);
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleStartModule = (module) => {
    setSelectedModule(module);
    console.log('Starting vocabulary module:', module.title);
  };

  const levels = ['A1', 'A2', 'B1', 'B2'];

  const getCurrentModules = () => {
    return vocabularyModules[selectedLevel] || [];
  };

  const getTotalProgress = () => {
    const modules = getCurrentModules();
    if (modules.length === 0) return 0;
    const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0);
    return Math.round(totalProgress / modules.length);
  };

  const getCompletedCount = () => {
    const modules = getCurrentModules();
    return modules.filter(module => module.progress === 100).length;
  };

  const getTotalWordsLearned = () => {
    const modules = getCurrentModules();
    return modules.reduce((sum, module) => sum + module.learned, 0);
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-300 ${isDarkMode ? 'dark  text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-10 h-10 text-green-500" />
            <div>
              <h1 className="text-4xl font-bold">📚 Vocabulary Modules</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Expand your vocabulary with interactive learning modules
              </p>
            </div>
          </div>

          {/* Level Selection */}
          <div className="flex flex-wrap gap-2 mb-6">
            {levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                onClick={() => setSelectedLevel(level)}
                className="font-medium"
              >
                Level {level}
              </Button>
            ))}
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="text-3xl font-bold">{getTotalProgress()}%</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Overall Progress</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="text-3xl font-bold">{getCompletedCount()}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Completed Modules</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-500" />
                <div>
                  <h3 className="text-3xl font-bold">{getTotalWordsLearned()}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Words Learned</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="text-3xl font-bold">{getCurrentModules().length}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Available Modules</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Vocabulary Modules Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Level {selectedLevel} Vocabulary Modules</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getCurrentModules().map((module) => (
              <VocabularyModuleCard
                key={module.id}
                module={module}
                onStart={handleStartModule}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Quick Review</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Practice words you've learned in a 5-minute session
                </p>
                <Button className="w-full">Start Quick Review</Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <Brain className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Word Challenge</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Test your vocabulary knowledge with daily challenges
                </p>
                <Button className="w-full" variant="outline">Take Challenge</Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <Volume2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Pronunciation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Practice pronunciation of your learned vocabulary
                </p>
                <Button className="w-full" variant="outline">Practice Speaking</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Recent Vocabulary Activity
            </h3>
            <div className="space-y-3">
              {recentVocabActivity.map((activity, index) => (
                <ActivityCard key={index} activity={activity} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Vocabulary Achievements
            </h3>
            <div className="space-y-3">
              {vocabularyAchievements.map((achievement, index) => (
                <AchievementCard key={index} achievement={achievement} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}