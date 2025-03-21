import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axios from 'axios';
import './Home.css';

function Home() {
  const [username, setUsername] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/user', { username });
      login(username);
      navigate('/questions');
    } catch (error) {
      alert('Error creating user');
    }
  };

  return (
    
    <form onSubmit={handleSubmit}>
        <h3>Enter User Name</h3>
      <input value={username} onChange={(e) => setUsername(e.target.value)} required />
      <button type="submit">Enter</button>
    </form>
  );
}

export default Home;
