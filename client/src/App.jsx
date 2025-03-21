import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Questions from './Questions';
import Ask from './Ask';
import QuestionDetail from './QuestionDetail';
import MyQuestions from './MyQuestions';
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/my-questions" element={<MyQuestions />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}
export default App;
