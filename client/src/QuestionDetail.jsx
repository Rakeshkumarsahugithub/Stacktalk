import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axios from 'axios';
import './Details.css';


function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const { username } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/questions/${id}`).then(res => setQuestion(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:3000/questions/${id}/answers`, { username, answer });
    setAnswer('');
    setQuestion(prev => ({ ...prev, answers: [...prev.answers, { username, answer }] }));
  };

  return question && (
    <div>
      <button onClick={() => navigate('/questions')}>Back to Questions</button>
      <h1>{question.title}</h1>
      <p>{question.body}</p>
      {question.answers.map((a, i) => (
        <p key={i}>{a.answer} – {a.username}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} required />
        <button type="submit">Answer</button>
      </form>
    </div>
  );
}

export default QuestionDetail;
