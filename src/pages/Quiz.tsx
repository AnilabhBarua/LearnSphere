import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Quiz as QuizType, QuizQuestion } from '../types/course';

const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Mock quiz data (replace with API call)
  const quiz: QuizType = {
    id: 1,
    course_id: 1,
    title: "Module 1 Quiz",
    questions: [
      {
        id: 1,
        quiz_id: 1,
        question: "What is the main purpose of this course?",
        options: [
          "To learn programming",
          "To understand design patterns",
          "To master web development",
          "To explore computer science"
        ],
        correct_answer: 2
      },
      // Add more questions...
    ],
    time_limit: 10
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Calculate score
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === quiz.questions[index].correct_answer ? 1 : 0);
    }, 0);

    setQuizSubmitted(true);
    // Submit to backend...
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <div className="text-lg font-semibold text-indigo-600">
              Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>

          {!quizSubmitted ? (
            <>
              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-2">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </div>
                <div className="text-lg font-medium text-gray-900 mb-4">
                  {quiz.questions[currentQuestion].question}
                </div>
                <div className="space-y-3">
                  {quiz.questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(curr => curr - 1)}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 text-indigo-600 disabled:text-gray-400"
                >
                  Previous
                </button>
                {currentQuestion === quiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion(curr => curr + 1)}
                    className="px-4 py-2 text-indigo-600"
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
              <p className="text-lg text-gray-600">
                Your score: {selectedAnswers.reduce((acc, answer, index) => {
                  return acc + (answer === quiz.questions[index].correct_answer ? 1 : 0);
                }, 0)} / {quiz.questions.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;