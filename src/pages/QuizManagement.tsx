import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Upload, Download, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Quiz, QuizQuestion } from '../types/course';

// Mock data for initial quizzes
const mockQuizzes: Quiz[] = [
  {
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
      }
    ]
  },
  {
    id: 2,
    course_id: 1,
    title: 'React Hooks Deep Dive',
    time_limit: 45,
    questions: [
      {
        id: 3,
        quiz_id: 2,
        question: 'What is the useEffect hook used for?',
        options: [
          'To create side effects',
          'To manage state',
          'To define routes',
          'To style components'
        ],
        correct_answer: 0
      }
    ]
  }
];

const QuizManagement = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    time_limit: 30,
    course_id: 1,
    questions: [] as QuizQuestion[],
  });
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
  });

  const handleCreateQuiz = () => {
    const quiz: Quiz = {
      id: quizzes.length + 1,
      ...newQuiz,
      questions: []
    };
    setQuizzes([...quizzes, quiz]);
    setShowCreateModal(false);
    setNewQuiz({
      title: '',
      time_limit: 30,
      course_id: 1,
      questions: [],
    });
  };

  const handleAddQuestion = () => {
    if (selectedQuiz) {
      const question: QuizQuestion = {
        id: Math.max(...selectedQuiz.questions.map(q => q.id), 0) + 1,
        quiz_id: selectedQuiz.id,
        ...newQuestion
      };
      const updatedQuiz = {
        ...selectedQuiz,
        questions: [...selectedQuiz.questions, question]
      };
      setQuizzes(quizzes.map(q => q.id === selectedQuiz.id ? updatedQuiz : q));
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
      });
    }
  };

  const handleDeleteQuiz = (quizId: number) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Quiz
        </button>
      </div>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Quiz</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={newQuiz.time_limit}
                  onChange={(e) => setNewQuiz({ ...newQuiz, time_limit: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateQuiz}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedQuiz(quiz)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>{quiz.time_limit} minutes</span>
                <span className="mx-2">•</span>
                <FileText className="h-4 w-4 mr-1" />
                <span>{quiz.questions.length} questions</span>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setSelectedQuiz(quiz)}
                  className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                >
                  Manage Questions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Quiz Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Edit Quiz: {selectedQuiz.title}
              </h2>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Add Question Form */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Question</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter question"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={newQuestion.correct_answer === index}
                        onChange={() => setNewQuestion({ ...newQuestion, correct_answer: index })}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion({ ...newQuestion, options: newOptions });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddQuestion}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Question
                </button>
              </div>
            </div>

            {/* Question List */}
            <div className="space-y-4">
              {selectedQuiz.questions.map((question, index) => (
                <div key={question.id} className="bg-white border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-gray-900">
                      Question {index + 1}: {question.question}
                    </h4>
                    <button
                      onClick={() => {
                        const updatedQuiz = {
                          ...selectedQuiz,
                          questions: selectedQuiz.questions.filter(q => q.id !== question.id)
                        };
                        setQuizzes(quizzes.map(q => q.id === selectedQuiz.id ? updatedQuiz : q));
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="ml-4 space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded ${
                          optIndex === question.correct_answer
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;