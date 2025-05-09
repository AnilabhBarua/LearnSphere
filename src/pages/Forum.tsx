import React, { useState } from 'react';
import { MessageSquare, Plus, ThumbsUp, Reply, Trash2, Calendar, BookOpen, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ForumPost } from '../types/course';

const Forum = () => {
  const { user } = useAuth();
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', course_id: 1 });
  const [newReply, setNewReply] = useState<{ [key: number]: string }>({});
  const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({});
  const [selectedCourse, setSelectedCourse] = useState<number | 'all'>('all');

  // Mock courses
  const courses = [
    { id: 1, title: 'Human-Computer Interaction (HCI)' },
    { id: 2, title: 'Artificial Intelligence and Machine Learning' }
  ];

  // Mock forum posts with course-specific discussions
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 1,
      course_id: 1, // HCI
      user_id: 1,
      title: "Principles of User-Centered Design",
      content: "I'm working on a project and struggling with implementing user-centered design principles. How do you effectively gather user requirements and translate them into design decisions?",
      created_at: "2024-03-15T10:00:00Z",
      updated_at: "2024-03-15T10:00:00Z",
      replies: [
        {
          id: 1,
          post_id: 1,
          user_id: 2,
          content: "Start with user interviews and surveys to understand their needs. Create user personas and journey maps to visualize their experiences. Then, prototype and test your designs iteratively with real users.",
          created_at: "2024-03-15T10:30:00Z"
        },
        {
          id: 2,
          post_id: 1,
          user_id: 3,
          content: "Don't forget about accessibility considerations in your design. Tools like color contrast checkers and screen reader testing can help ensure your design is inclusive.",
          created_at: "2024-03-15T11:00:00Z"
        }
      ]
    },
    {
      id: 2,
      course_id: 2, // AI/ML
      user_id: 2,
      title: "Understanding Neural Network Architecture",
      content: "Can someone explain the difference between CNN and RNN architectures? When should we use each one?",
      created_at: "2024-03-16T09:00:00Z",
      updated_at: "2024-03-16T09:00:00Z",
      replies: [
        {
          id: 3,
          post_id: 2,
          user_id: 1,
          content: "CNNs (Convolutional Neural Networks) are great for spatial data like images. They use convolution operations to detect patterns. RNNs (Recurrent Neural Networks) are better for sequential data like text or time series, as they can remember previous inputs.",
          created_at: "2024-03-16T09:30:00Z"
        }
      ]
    },
    {
      id: 3,
      course_id: 1, // HCI
      user_id: 3,
      title: "Usability Testing Methods",
      content: "What are the most effective methods for conducting usability testing? Should I focus on in-person testing or remote testing tools?",
      created_at: "2024-03-17T11:00:00Z",
      updated_at: "2024-03-17T11:00:00Z",
      replies: [
        {
          id: 4,
          post_id: 3,
          user_id: 4,
          content: "Both methods have their advantages. In-person testing allows for better observation of user behavior and immediate follow-up questions. Remote testing can reach more diverse users and is often more cost-effective.",
          created_at: "2024-03-17T11:30:00Z"
        }
      ]
    },
    {
      id: 4,
      course_id: 2, // AI/ML
      user_id: 4,
      title: "Handling Overfitting in Machine Learning Models",
      content: "My model performs great on training data but poorly on test data. What techniques can I use to prevent overfitting?",
      created_at: "2024-03-18T14:00:00Z",
      updated_at: "2024-03-18T14:00:00Z",
      replies: [
        {
          id: 5,
          post_id: 4,
          user_id: 1,
          content: "Try these techniques: 1) Regularization (L1/L2), 2) Dropout layers, 3) Cross-validation, 4) Early stopping, 5) Data augmentation. Also, make sure your training data is representative of real-world scenarios.",
          created_at: "2024-03-18T14:30:00Z"
        }
      ]
    }
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const newForumPost: ForumPost = {
      id: posts.length + 1,
      course_id: parseInt(newPost.course_id.toString()),
      user_id: user?.id || 1,
      title: newPost.title,
      content: newPost.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      replies: []
    };
    setPosts([newForumPost, ...posts]);
    setNewPost({ title: '', content: '', course_id: 1 });
    setShowNewPostForm(false);
  };

  const handleAddReply = (postId: number) => {
    const replyContent = newReply[postId];
    if (!replyContent?.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, {
            id: Math.max(...post.replies.map(r => r.id), 0) + 1,
            post_id: postId,
            user_id: user?.id || 1,
            content: replyContent,
            created_at: new Date().toISOString()
          }]
        };
      }
      return post;
    }));
    setNewReply({ ...newReply, [postId]: '' });
  };

  const handleDeletePost = (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredPosts = selectedCourse === 'all' 
    ? posts 
    : posts.filter(post => post.course_id === selectedCourse);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discussion Forum</h1>
          <button
            onClick={() => setShowNewPostForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Discussion
          </button>
        </div>

        {/* Course Filter */}
        <div className="mb-6 flex items-center bg-white rounded-lg shadow-sm p-4">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>

        {showNewPostForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Start New Discussion</h2>
              <button
                onClick={() => setShowNewPostForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                  Course
                </label>
                <select
                  id="course"
                  value={newPost.course_id}
                  onChange={(e) => setNewPost({ ...newPost, course_id: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  rows={4}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-indigo-600">
                        {courses.find(c => c.id === post.course_id)?.title}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                  {user?.id === post.user_id && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button
                    onClick={() => setShowReplies({ ...showReplies, [post.id]: !showReplies[post.id] })}
                    className="flex items-center hover:text-indigo-600"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.replies.length} Replies
                  </button>
                  <button className="flex items-center hover:text-indigo-600">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Like
                  </button>
                </div>
              </div>

              {showReplies[post.id] && (
                <div className="bg-gray-50 p-6 border-t">
                  <div className="space-y-4">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-indigo-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-gray-600">{reply.content}</p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(reply.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Reply className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <textarea
                          placeholder="Write a reply..."
                          value={newReply[post.id] || ''}
                          onChange={(e) => setNewReply({ ...newReply, [post.id]: e.target.value })}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          rows={3}
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => handleAddReply(post.id)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;