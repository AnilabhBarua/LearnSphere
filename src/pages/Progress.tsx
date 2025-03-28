import React from 'react';
import { Progress as ProgressType } from '../types/course';
import { BarChart, CheckCircle, Circle } from 'lucide-react';

const Progress = () => {
  // Mock progress data (replace with API call)
  const progress: ProgressType = {
    course_id: 1,
    completed_content: [1, 2, 3],
    quiz_scores: {
      1: 85,
      2: 90,
      3: 95
    },
    overall_progress: 75
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Progress</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h2>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                  Course Completion
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {progress.overall_progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${progress.overall_progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Performance</h2>
            <div className="space-y-4">
              {Object.entries(progress.quiz_scores).map(([quizId, score]) => (
                <div key={quizId} className="flex items-center justify-between">
                  <span className="text-gray-600">Quiz {quizId}</span>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-indigo-600">{score}%</span>
                    {score >= 90 ? (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 ml-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Completion</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Videos Watched</span>
                <span className="text-lg font-medium text-indigo-600">7/10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Assignments Completed</span>
                <span className="text-lg font-medium text-indigo-600">4/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Reading Materials</span>
                <span className="text-lg font-medium text-indigo-600">12/15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;