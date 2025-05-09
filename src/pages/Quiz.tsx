import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quiz as QuizType } from '../types/course';
import { Clock, AlertCircle, CheckCircle, XCircle, PlayCircle, FileText, AlertTriangle } from 'lucide-react';

// Mock quiz data
const mockQuiz: QuizType = {
  id: 1,
  course_id: 1,
  title: 'JavaScript Fundamentals',
  time_limit: 30,
  questions: [
    {
      id: 1,
      quiz_id: 1,
      question: 'What is closure in JavaScript?',
      options: [
        'A way to close browser window',
        'A function that has access to variables in its outer scope',
        'A method to end loops',
        'A way to close database connections'
      ],
      correct_answer: 1
    },
    {
      id: 2,
      quiz_id: 1,
      question: 'What is the purpose of useState in React?',
      options: [
        'To create global state',
        'To manage component state',
        'To handle API calls',
        'To define routes'
      ],
      correct_answer: 1
    },
    {
      id: 3,
      quiz_id: 1,
      question: 'What does useEffect do?',
      options: [
        'Handles side effects in components',
        'Creates new components',
        'Manages routing',
        'Handles form validation'
      ],
      correct_answer: 0
    }
  ]
};

const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizType | null>(mockQuiz);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number[];
  } | null>(null);

  useEffect(() => {
    if (quiz) {
      setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    }
  }, [quiz]);

  useEffect(() => {
    if (!quizStarted || !timeRemaining || timeRemaining <= 0 || quizSubmitted) return;

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
  }, [timeRemaining, quizSubmitted, quizStarted]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(quiz?.time_limit ? quiz.time_limit * 60 : 0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!quiz) return;

    const incorrectAnswers: number[] = [];
    let correctCount = 0;

    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctCount++;
      } else {
        incorrectAnswers.push(index);
      }
    });

    const score = (correctCount / quiz.questions.length) * 100;

    setResult({
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      incorrectAnswers
    });

    setQuizSubmitted(true);
    setShowResults(true);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900">Quiz not found</h2>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
          </div>
          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Quiz Information</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Time Limit: {quiz.time_limit} minutes</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FileText className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Total Questions: {quiz.questions.length}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Important Instructions</h2>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6 space-y-3">
                <p className="text-gray-700">• The timer will start as soon as you begin the quiz</p>
                <p className="text-gray-700">• You cannot pause the timer once started</p>
                <p className="text-gray-700">• The quiz will auto-submit when the time is up</p>
                <p className="text-gray-700">• You can review and change your answers before submitting</p>
                <p className="text-gray-700">• Make sure you have a stable internet connection</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStartQuiz}
                className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlayCircle className="h-6 w-6 mr-2" />
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Quiz Results</h2>
          </div>
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-4">
                <span className="text-3xl font-bold text-indigo-600">
                  {Math.round(result.score)}%
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {result.score >= 70 ? 'Congratulations!' : 'Keep practicing!'}
              </h3>
              <p className="text-gray-600 mt-2">
                You got {result.correctAnswers} out of {result.totalQuestions} questions correct
              </p>
            </div>

            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg ${
                    result.incorrectAnswers.includes(index)
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <div className="flex items-start">
                    {result.incorrectAnswers.includes(index) ? (
                      <XCircle className="h-5 w-5 text-red-500 mt-1 mr-2" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-2" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Question {index + 1}: {question.question}
                      </h4>
                      <div className="mt-2 space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded ${
                              optIndex === question.correct_answer
                                ? 'bg-green-100 text-green-500'
                                : optIndex === selectedAnswers[index]
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100'
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/courses')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Return to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
          <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg">
            <Clock className="h-5 w-5 text-white mr-2" />
            <span className="text-white font-medium">
              {timeRemaining ? formatTime(timeRemaining) : '00:00'}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm font-medium text-indigo-600">
                {Math.round((selectedAnswers.filter(a => a !== -1).length / quiz.questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentQuestion / quiz.questions.length) * 100}%`
                }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {quiz.questions[currentQuestion].question}
            </h2>
            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="inline-block w-6 h-6 rounded-full border-2 mr-3 align-middle text-center text-sm
                    ${selectedAnswers[currentQuestion] === index ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'}">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion(curr => curr - 1)}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-indigo-600 disabled:text-gray-400 disabled:cursor-not-allowed"
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