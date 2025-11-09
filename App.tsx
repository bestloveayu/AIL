
import React, { useState, useCallback } from 'react';
import { questions } from './data/questions';
import { Question, UserAnswers, UserAnswer } from './types';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';

type GameState = 'welcome' | 'quiz' | 'results';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

  const handleStartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setGameState('quiz');
  };

  const handleAnswerSelect = useCallback((questionId: number, answer: UserAnswer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  
  const handleFinishQuiz = () => {
    setGameState('results');
  };

  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-cyan-400 mb-4">AI 知識測驗</h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
        本測驗包含 50 道題目，涵蓋人工智慧、大數據與智慧科技等領域。每題 20 分，總分 1000 分。達到 700 分以上為合格。準備好挑戰了嗎？
      </p>
      <button
        onClick={handleStartQuiz}
        className="px-8 py-4 bg-cyan-500 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-600 transition-transform transform hover:scale-105 duration-300"
      >
        開始測驗
      </button>
    </div>
  );

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 flex items-center justify-center">
      <main className="w-full max-w-4xl mx-auto">
        {gameState === 'welcome' && <WelcomeScreen />}
        {gameState === 'quiz' && currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNextQuestion}
            onPrev={handlePrevQuestion}
            onFinish={handleFinishQuiz}
          />
        )}
        {gameState === 'results' && (
          <ResultsScreen 
            userAnswers={userAnswers}
            questions={questions}
            onRestart={handleStartQuiz}
          />
        )}
      </main>
    </div>
  );
};

export default App;
