import React, { useState, useEffect } from 'react';
import { questions, Question } from '../data/questions';
import { Timer } from 'lucide-react';

interface QuizProps {
  username: string;
  onRestart: () => void;
}

export function Quiz({ username, onRestart }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleNext();
    }
  }, [timeLeft, isAnswered]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg mb-2">Congratulations, {username}!</p>
          <p className="text-xl mb-4">Your score: {score}/{questions.length}</p>
          <div className="text-lg mb-4">
            Percentage: {((score / questions.length) * 100).toFixed(1)}%
          </div>
          <button
            onClick={onRestart}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const question: Question = questions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-500" />
            <span className={`font-mono ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        <h2 className="text-xl mb-6">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-md transition-all ${
                selectedAnswer === null
                  ? 'hover:bg-blue-50 bg-gray-50'
                  : selectedAnswer === index
                  ? index === question.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                  : index === question.correctAnswer && isAnswered
                  ? 'bg-green-100 border-green-500'
                  : 'bg-gray-50'
              }`}
              disabled={isAnswered}
            >
              {option}
            </button>
          ))}
        </div>

        {isAnswered && (
          <button
            onClick={handleNext}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Show Results'}
          </button>
        )}
      </div>
    </div>
  );
}