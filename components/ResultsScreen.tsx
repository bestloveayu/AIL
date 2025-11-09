
import React, { useMemo } from 'react';
import { Question, UserAnswers, UserAnswer } from '../types';

interface ResultsScreenProps {
  userAnswers: UserAnswers;
  questions: Question[];
  onRestart: () => void;
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const isAnswerCorrect = (question: Question, answer: UserAnswer): boolean => {
  if (answer === undefined || answer === null) return false;
  if (Array.isArray(question.correctAnswer)) {
    if (!Array.isArray(answer)) return false;
    return question.correctAnswer.length === answer.length && question.correctAnswer.every(val => answer.includes(val));
  } else {
    return question.correctAnswer === answer;
  }
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ userAnswers, questions, onRestart }) => {
  const { score, correctAnswersCount, incorrectAnswers } = useMemo(() => {
    let correctCount = 0;
    const incorrect: { question: Question; userAnswer: UserAnswer }[] = [];

    questions.forEach((q) => {
      const answer = userAnswers[q.id];
      if (isAnswerCorrect(q, answer)) {
        correctCount++;
      } else {
        incorrect.push({ question: q, userAnswer: answer });
      }
    });

    return {
      score: correctCount * 20,
      correctAnswersCount: correctCount,
      incorrectAnswers: incorrect,
    };
  }, [userAnswers, questions]);

  const passingScore = 700;
  const didPass = score >= passingScore;

  const formatAnswer = (answer: UserAnswer | string | string[]): string => {
    if (answer === undefined || answer === null) return "未作答";
    if (Array.isArray(answer)) return answer.join(', ');
    return answer.toString();
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 animate-fade-in w-full">
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold ${didPass ? 'text-green-400' : 'text-red-400'}`}>
          {didPass ? '恭喜！測驗通過！' : '再接再厲！'}
        </h1>
        <p className="text-6xl font-bold my-4">{score} <span className="text-2xl text-gray-400">/ 1000</span></p>
        <p className="text-lg text-gray-300">
          您答對了 {correctAnswersCount} 題，答錯了 {incorrectAnswers.length} 題。
        </p>
      </div>
      
      <div className="text-center mb-8">
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-cyan-500 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-600 transition-transform transform hover:scale-105 duration-300"
        >
          再試一次
        </button>
      </div>

      {incorrectAnswers.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-center mb-6 border-b-2 border-gray-700 pb-2">錯題回顧</h2>
          <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
            {incorrectAnswers.map(({ question, userAnswer }, index) => (
              <div key={question.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <p className="font-semibold text-lg mb-3">
                  <span className="text-gray-400 mr-2">Q{question.id}.</span> {question.text}
                </p>
                <div className="text-red-400 bg-red-900/30 p-2 rounded flex items-center">
                  <XIcon /> 您的答案：{formatAnswer(userAnswer)}
                </div>
                <div className="text-green-400 bg-green-900/30 p-2 rounded mt-2 flex items-center">
                  <CheckIcon /> 正確答案：{formatAnswer(question.correctAnswer)}
                </div>
                <p className="text-cyan-300 mt-3 text-sm italic">{question.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsScreen;
