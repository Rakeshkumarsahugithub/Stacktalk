import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Questions() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/questions').then(res => setQuestions(res.data));
  }, []);

  return (
    <div>
      <Link to="/ask">Ask Question</Link>
      <Link to="/my-questions">My Questions</Link>
      {questions.map(q => (
        <div key={q._id}>
          <Link to={`/questions/${q._id}`}>{q.title}</Link>
        </div>
      ))}
    </div>
  );
}

export default Questions;
