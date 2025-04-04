import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Upload, Download, FileText } from 'lucide-react';
import { Quiz, QuizQuestion } from '../types/course';

const QuizManagement = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questionBank, setQuestionBank] = useState<QuizQuestion[]>([]);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    time_limit: 30,
    course_id: 0,
    questions: [] as QuizQuestion[],
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const questions = JSON.parse(e.target?.result as string);
        setQuestionBank((prev) => [...prev, ...questions]);
      } catch (error) {
        console.error('Error parsing question bank:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleQuestionAdd = (question: QuizQuestion) => {
    setNewQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, question],
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowQuestionBank(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Upload className="h-5 w-5 mr-2" />
            Question Bank
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Quiz
          </button>
        </div>
      </div>

      {/* Question Bank Modal */}
      {showQuestionBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Question Bank</h2>
              <button
                onClick={() => setShowQuestionBank(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="questionBankUpload"
                  className="hidden"
                  accept=".json"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="questionBankUpload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-600">
                    Upload Question Bank (JSON format)
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {questionBank.map((question, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{question.question}</h3>
                    <button
                      onClick={() => handleQuestionAdd(question)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Add to Quiz
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

      {/* Quiz List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quiz Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Limit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td className="px-6 py-4 whitespace-nowrap">{quiz.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {quiz.questions.length} questions
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{quiz.time_limit} minutes</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedQuiz(quiz)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizManagement;