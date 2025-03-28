import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizzes } from '../services/api';
import { Quiz as QuizType } from '../types/course';
import { Clock, AlertCircle } from 'lucide-react';

const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
  } | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!id) return;
        const quizData = await quizzes.getById(Number(id));
        setQuiz(quizData);
        setTimeRemaining(quizData.time_limit * 60); // Convert minutes to seconds
        setSelectedAnswers(new Array(quizData.questions.length).fill(-1));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0 || quizSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, quizSubmitted]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      if (!quiz || !id) return;
      const response = await quizzes.submit(Number(id), selectedAnswers);
      setResult(response);
      setQuizSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600">{error || 'Quiz not found'}</p>
      </div>
    );
  }

  if (quizSubmitted && result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Results</h2>
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Your Score: {result.score}%
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-lg font-medium text-gray-900">{result.totalQuestions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                  <p className="text-lg font-medium text-gray-900">{result.correctAnswers}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/courses')}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Return to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <div className="flex items-center text-lg font-semibold text-indigo-600">
              <Clock className="h-5 w-5 mr-2" />
              {Math.floor(timeRemaining! / 60)}:{(timeRemaining! % 60).toString().padStart(2, '0')}
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default Quiz;