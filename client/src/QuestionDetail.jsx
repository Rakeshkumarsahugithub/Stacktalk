import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axios from 'axios';

function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { username } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:3000/questions/${id}`);
      setQuestion(response.data);
    } catch (error) {
      setError('Failed to load question. Please try again.');
      console.error('Error fetching question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      setError('Please enter your answer');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`http://localhost:3000/questions/${id}/answers`, { 
        username, 
        answer: answer.trim() 
      });
      setQuestion(response.data);
      setAnswer('');
    } catch (error) {
      if (error.response?.status === 400) {
        setError('Invalid answer. Please check your input.');
      } else if (error.response?.status === 404) {
        setError('Question not found.');
      } else {
        setError('Failed to post answer. Please try again.');
      }
      console.error('Error posting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-danger mb-4">{error}</p>
          <button onClick={fetchQuestion} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Question not found</p>
          <button onClick={() => navigate('/questions')} className="btn btn-primary">
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => navigate('/questions')}
              className="btn btn-secondary"
            >
              ← Back to Questions
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="question-detail-card mb-8">
          <div className="question-detail-body">
            <h1 className="question-detail-title">
              {question.title}
            </h1>
            <div className="question-detail-content">
              {question.body}
            </div>
            <div className="question-detail-meta">
              <span className="meta-author">
                <span className="meta-dot blue"></span>
                Asked by <span>{question.username}</span>
              </span>
              <span className="meta-sep">•</span>
              <span>{formatDate(question.createdAt || new Date())}</span>
              <span className="meta-sep">•</span>
              <span className="meta-answers">
                <span>💬</span>
                {question.answers?.length || 0} answer{(question.answers?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Answers ({question.answers?.length || 0})
          </h2>
          {!question.answers || question.answers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">🤔</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No answers yet</h3>
              <p className="text-gray-600">
                Be the first to answer this question!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {question.answers.map((answer, index) => (
                <div key={index} className="answer-card">
                  <div className="answer-meta">
                    <span className="meta-dot green"></span>
                    Answered by <span>{answer.username}</span>
                    <span className="meta-sep">•</span>
                    <span>{formatDate(answer.timestamp || new Date())}</span>
                  </div>
                  <div className="answer-body">
                    {answer.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900">Your Answer</h3>
            <p className="text-gray-600 mt-1">
              Share your knowledge and help the community
            </p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="answer" className="form-label">
                  Your Answer
                </label>
                <textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="form-textarea"
                  placeholder="Write your answer here. Be helpful and provide clear explanations."
                  disabled={isSubmitting}
                  rows={6}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Posting Answer...
                    </>
                  ) : (
                    'Post Answer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;
