import React, { useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { ForumPost } from '../types/course';

const Forum = () => {
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // Mock forum posts (replace with API call)
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 1,
      course_id: 1,
      user_id: 1,
      title: "Help with Assignment 2",
      content: "I'm having trouble understanding the concept of state management in React...",
      created_at: "2024-03-15T10:00:00Z",
      updated_at: "2024-03-15T10:00:00Z",
      replies: [
        {
          id: 1,
          post_id: 1,
          user_id: 2,
          content: "Let me help you understand this better...",
          created_at: "2024-03-15T10:30:00Z"
        }
      ]
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discussion Forum</h1>
          <button
            onClick={() => setShowNewPostForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Post
          </button>
        </div>

        {showNewPostForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Post</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                ></textarea>
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
                  Post
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
                  <span className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{post.replies.length} replies</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Replies</h3>
                <div className="space-y-4">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <p className="text-gray-600">{reply.content}</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <textarea
                    placeholder="Write a reply..."
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    rows={3}
                  ></textarea>
                  <div className="mt-2 flex justify-end">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;