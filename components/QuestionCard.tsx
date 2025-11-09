
import React from 'react';
import { Question, QuestionType, UserAnswer } from '../types';

interface QuestionCardProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswer: UserAnswer;
  onAnswerSelect: (questionId: number, answer: UserAnswer) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
      <div
        className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  userAnswer,
  onAnswerSelect,
  onNext,
  onPrev,
  onFinish,
}) => {

  const handleSingleSelect = (optionId: string) => {
    onAnswerSelect(question.id, optionId);
  };
  
  const handleMultiSelect = (optionId: string) => {
    const currentAnswers = (Array.isArray(userAnswer) ? userAnswer : []) as string[];
    const newAnswers = currentAnswers.includes(optionId)
      ? currentAnswers.filter((id) => id !== optionId)
      : [...currentAnswers, optionId];
    onAnswerSelect(question.id, newAnswers.sort());
  };
  
  const getOptionClass = (optionId: string, type: QuestionType) => {
    let baseClass = "w-full text-left p-4 my-2 border-2 rounded-lg transition-all duration-200 cursor-pointer";
    let isSelected = false;

    if (type === QuestionType.MULTIPLE_CHOICE) {
      isSelected = Array.isArray(userAnswer) && userAnswer.includes(optionId);
    } else {
      isSelected = userAnswer === optionId;
    }

    if (isSelected) {
      return `${baseClass} bg-cyan-500 border-cyan-400 shadow-lg`;
    }
    return `${baseClass} bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-cyan-500`;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 animate-fade-in">
      <ProgressBar current={currentQuestionIndex} total={totalQuestions} />
      <div className="mb-6">
        <p className="text-cyan-400 font-semibold mb-2">
          第 {currentQuestionIndex + 1} / {totalQuestions} 題
        </p>
        <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{question.text}</h2>
      </div>

      <div className="flex flex-col">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => question.type === QuestionType.MULTIPLE_CHOICE ? handleMultiSelect(option.id) : handleSingleSelect(option.id)}
            className={getOptionClass(option.id, question.type)}
          >
            <span className="font-bold mr-3">{question.type !== QuestionType.TRUE_FALSE ? `${option.id}.` : ''}</span>
            {option.text}
          </button>
        ))}
      </div>
      
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一題
        </button>
        {currentQuestionIndex === totalQuestions - 1 ? (
          <button
            onClick={onFinish}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            完成測驗
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors"
          >
            下一題
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
