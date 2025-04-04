import React, { useState, useEffect } from 'react';
import { BarChart2, Download, Calendar, Users, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ReportData {
  studentId: number;
  studentName: string;
  quizzes: {
    quizId: number;
    quizTitle: string;
    score: number;
    completedAt: string;
  }[];
  averageScore: number;
  totalQuizzes: number;
  completionRate: number;
}

const Reports = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const generateReport = async () => {
    setLoading(true);
    // In a real application, this would fetch data from your API
    // Simulating API call with mock data
    setTimeout(() => {
      const mockData: ReportData[] = [
        {
          studentId: 1,
          studentName: 'John Doe',
          quizzes: [
            {
              quizId: 1,
              quizTitle: 'JavaScript Basics',
              score: 85,
              completedAt: '2024-03-15T10:00:00Z',
            },
            {
              quizId: 2,
              quizTitle: 'React Fundamentals',
              score: 92,
              completedAt: '2024-03-16T14:30:00Z',
            },
          ],
          averageScore: 88.5,
          totalQuizzes: 2,
          completionRate: 100,
        },
        // Add more mock data as needed
      ];
      setReportData(mockData);
      setLoading(false);
    }, 1000);
  };

  const downloadReport = () => {
    const reportJson = JSON.stringify(reportData, null, 2);
    const blob = new Blob([reportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Performance Reports</h1>
        <div className="flex space-x-4">
          <button
            onClick={downloadReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Report
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'weekly' | 'monthly')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={generateReport}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reportData.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reportData.length > 0
                  ? (
                      reportData.reduce((acc, curr) => acc + curr.averageScore, 0) /
                      reportData.length
                    ).toFixed(1) + '%'
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <BarChart2 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reportData.length > 0
                  ? (
                      reportData.reduce((acc, curr) => acc + curr.completionRate, 0) /
                      reportData.length
                    ).toFixed(1) + '%'
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quizzes Taken
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completion Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.map((student) => (
              <tr key={student.studentId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {student.studentName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.totalQuizzes}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {student.averageScore.toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {student.completionRate}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;