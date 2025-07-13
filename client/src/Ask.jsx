import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axios from 'axios';

function Ask() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { username } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title for your question');
      return;
    }
    
    if (!body.trim()) {
      setError('Please enter the details of your question');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/questions', { 
        username, 
        title: title.trim(), 
        body: body.trim() 
      });
      navigate('/questions');
    } catch (error) {
      if (error.response?.status === 400) {
        setError('Invalid data. Please check your input.');
      } else {
        setError('Failed to post question. Please try again.');
      }
      console.error('Error posting question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || body.trim()) {
      if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
        navigate('/questions');
      }
    } else {
      navigate('/questions');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              ← Back to Questions
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
          <p className="text-gray-600 mt-2">
            Share your knowledge or get help from the community
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Question Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  placeholder="What's your question? Be specific."
                  disabled={isLoading}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {title.length}/200 characters
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="body" className="form-label">
                  Question Details *
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="form-textarea"
                  placeholder="Provide more context about your question. Include any relevant details, code examples, or specific scenarios."
                  disabled={isLoading}
                  rows={8}
                />
                <p className="text-sm text-gray-500 mt-1">
                  The more details you provide, the better answers you'll get.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className={`btn btn-primary flex-1 ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Posting Question...
                    </>
                  ) : (
                    'Post Question'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8">
          <div className="card bg-blue-50 border-blue-200">
            <div className="card-body">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                💡 Tips for a great question
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Be specific and clear about what you're asking</li>
                <li>• Include relevant code examples if applicable</li>
                <li>• Explain what you've already tried</li>
                <li>• Use a descriptive title that summarizes your question</li>
                <li>• Be respectful and patient with the community</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ask;
