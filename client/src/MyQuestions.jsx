import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axios from 'axios';

function MyQuestions() {
  const { username } = useUser();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      axios.get(`http://localhost:3000/user/${username}/questions`).then(res => setQuestions(res.data));
    }
  }, [username]);

  return (
    <div>
      <button onClick={() => navigate('/ask')}>Ask a Question</button>
      <button onClick={() => navigate('/questions')}>Back to Questions</button>
      <h1>{username}'s Questions</h1>
      {questions.length === 0 ? (
        <p>No questions asked yet.</p>
      ) : (
        questions.map((q) => (
          <div key={q._id}>
            <button onClick={() => navigate(`/questions/${q._id}`)}>{q.title}</button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyQuestions;
