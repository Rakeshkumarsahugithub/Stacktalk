import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const questionsPerPage = 10;

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterAndSortQuestions();
  }, [questions, searchTerm, sortOrder]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get('http://localhost:3000/questions');
      setQuestions(response.data);
    } catch (error) {
      setError('Failed to load questions. Please try again.');
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
        question.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.username.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-danger mb-4">{error}</p>
          <button onClick={fetchQuestions} className="btn btn-primary">
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
            <h1 className="text-3xl font-bold text-gray-900">All Questions</h1>
            <p className="text-gray-600 mt-2">
              {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/ask" className="btn btn-primary">
              Ask Question
            </Link>
            <Link to="/my-questions" className="btn btn-outline">
              My Questions
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="search-filter-row">
          <div className="search-input-wrapper">
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              placeholder="Search by title, content, or username..."
            />
            <span className="search-icon">🔍</span>
          </div>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {currentQuestions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤔</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No questions found' : 'No questions yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? `No questions match your search for "${searchTerm}"`
              : 'Be the first to ask a question and start the conversation!'
            }
          </p>
          {!searchTerm && (
            <Link to="/ask" className="btn btn-primary">
              Ask the First Question
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {currentQuestions.map((question) => (
              <div key={question._id} className="card hover:shadow-lg transition-all duration-200">
                <div className="card-body">
                  <div className="question-row">
                    <div className="question-main">
                      <h3 className="question-list-title">
                        {question.title}
                      </h3>
                      <p className="question-list-content">
                        {question.body}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          {question.username}
                        </span>
                        <span>•</span>
                        <span>{formatDate(question.createdAt || new Date())}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span>💬</span>
                          {question.answers?.length || 0} answer{(question.answers?.length || 0) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <Link 
                      to={`/questions/${question._id}`}
                      className="view-details-btn"
                    >
                      View Details <span className="view-details-arrow">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-bar mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredQuestions.length)} of {filteredQuestions.length} questions
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-nav-btn"
                >
                  <span className="pagination-arrow">←</span> Previous
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
                        className={`pagination-btn${currentPage === pageNum ? ' active' : ''}`}
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
                    className="pagination-input"
                    placeholder="Go to"
                  />
                  <button
                    type="submit"
                    className="pagination-goto-btn"
                  >
                    Go
                  </button>
                </form>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-nav-btn"
                >
                  Next <span className="pagination-arrow">→</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Questions;
