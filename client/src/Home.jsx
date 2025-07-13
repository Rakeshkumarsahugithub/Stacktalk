import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axios from 'axios';

function Home() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { username: currentUser, login } = useUser();
  const navigate = useNavigate();

  // Redirect to questions if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/questions');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/user', { username: username.trim() });
      login(username.trim());
      navigate('/questions');
    } catch (error) {
      if (error.response?.status === 400) {
        setError('Username already exists. Please try a different one.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the page if user is logged in (will redirect)
  if (currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Container */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side - Content & Login */}
            <div className="order-2 lg:order-1">
              {/* Logo/Brand */}
              <div className="text-center lg:text-left mb-8">
                <div className="text-5xl md:text-6xl mb-4">🚀</div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                  Welcome to <span className="text-blue-600">StackTalk</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                  The ultimate Q&A platform where knowledge meets community. Ask questions, find answers, and share your expertise with developers worldwide.
                </p>
              </div>

              {/* Login Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto lg:mx-0">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h2>
                  <p className="text-gray-600">Join the community in seconds</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">
                      Choose your username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-input"
                      placeholder="e.g., developer123"
                      disabled={isLoading}
                      autoFocus
                    />
                    {error && (
                      <p className="text-danger text-sm mt-2">{error}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className={`btn btn-primary w-full text-lg py-3 ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Creating Account...
                      </>
                    ) : (
                      '🚀 Start Exploring'
                    )}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-gray-500 text-sm">
                    Join thousands of developers sharing knowledge
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Features */}
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                
                {/* Feature 1 */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                      🤔
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ask Questions</h3>
                    <p className="text-gray-600">
                      Get answers from the community. No matter how complex your question is, there's always someone ready to help.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-2xl">
                      🎯
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Find Answers</h3>
                    <p className="text-gray-600">
                      Browse through thousands of questions and answers from experts. Learn from real-world problems and solutions.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                      🌟
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Share Knowledge</h3>
                    <p className="text-gray-600">
                      Help others by sharing your expertise and experience. Build your reputation in the developer community.
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl">
                      💬
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Build Community</h3>
                    <p className="text-gray-600">
                      Connect with developers worldwide. Engage in meaningful discussions and grow your professional network.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600">Active Developers</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                <div className="text-gray-600">Questions Answered</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Community Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 StackTalk. Built with ❤️ for the developer community.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
