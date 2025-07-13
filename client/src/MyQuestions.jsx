import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axios from 'axios';

function MyQuestions() {
  const { username } = useUser();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const questionsPerPage = 10;

  useEffect(() => {
    if (username) {
      fetchMyQuestions();
    }
  }, [username]);

  useEffect(() => {
    filterAndSortQuestions();
  }, [questions, searchTerm, sortOrder]);

  const fetchMyQuestions = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:3000/user/${username}/questions`);
      setQuestions(response.data);
    } catch (error) {
      setError('Failed to load your questions. Please try again.');
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortQuestions = () => {
    let filtered = [...questions];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(question =>
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a._id);
      const dateB = new Date(b.createdAt || b._id);
      
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    setFilteredQuestions(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageInput('');
    }
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageInput('');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-danger mb-4">{error}</p>
          <button onClick={fetchMyQuestions} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Questions
            </h1>
            <p className="text-gray-600 mt-2">
              {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigate('/ask')}
              className="btn btn-primary"
            >
              Ask New Question
            </button>
            <button 
              onClick={() => navigate('/questions')}
              className="btn btn-outline"
            >
              View All Questions
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="myq-search-filter-col">
          <div className="myq-search-input-wrapper">
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="myq-search-input"
              placeholder="Search by title or content..."
            />
            <span className="myq-search-icon">🔍</span>
          </div>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="myq-filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {currentQuestions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">📝</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {searchTerm ? 'No questions found' : 'You haven\'t asked any questions yet'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm 
              ? `No questions match your search for "${searchTerm}"`
              : 'Start contributing to the community by asking your first question. Share your knowledge and get help from others!'
            }
          </p>
          {!searchTerm && (
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => navigate('/ask')}
                className="btn btn-primary"
              >
                Ask Your First Question
              </button>
              <button 
                onClick={() => navigate('/questions')}
                className="btn btn-outline"
              >
                Browse Questions
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {currentQuestions.map((question) => (
              <div key={question._id} className="card hover:shadow-lg transition-all duration-200">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {question.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {question.body}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span>📅</span>
                          {formatDate(question.createdAt || new Date())}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span>💬</span>
                          {question.answers?.length || 0} answer{(question.answers?.length || 0) !== 1 ? 's' : ''}
                        </span>
                        {question.answers?.length === 0 && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600 font-medium">
                              No answers yet
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => navigate(`/questions/${question._id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        View Details
                      </button>
                      {question.answers?.length > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Has answers
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredQuestions.length)} of {filteredQuestions.length} questions
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Page Input */}
                <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
                  <input
                    type="number"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    min="1"
                    max={totalPages}
                    className="w-16 h-10 px-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Go to"
                  />
                  <button
                    type="submit"
                    className="btn btn-sm btn-outline"
                  >
                    Go
                  </button>
                </form>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Stats */}
      {questions.length > 0 && (
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-blue-50 border-blue-200">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {questions.length}
                </div>
                <p className="text-blue-800">Total Questions</p>
              </div>
            </div>
            <div className="card bg-green-50 border-green-200">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {questions.filter(q => q.answers?.length > 0).length}
                </div>
                <p className="text-green-800">Questions with Answers</p>
              </div>
            </div>
            <div className="card bg-orange-50 border-orange-200">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {questions.filter(q => q.answers?.length === 0).length}
                </div>
                <p className="text-orange-800">Unanswered Questions</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyQuestions;
