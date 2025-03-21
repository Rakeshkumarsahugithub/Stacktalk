const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/stacktalk');

// User Schema and Model
const userSchema = new mongoose.Schema({ username: { type: String, unique: true } });
const User = mongoose.model('User', userSchema);

// Question Schema and Model
const answerSchema = new mongoose.Schema({
  username: String,
  answer: String,
  timestamp: { type: Date, default: Date.now }
});
const questionSchema = new mongoose.Schema({
  username: String,
  title: String,
  body: String,
  answers: [answerSchema]
});
const Question = mongoose.model('Question', questionSchema);

// User Routes
app.post('/user', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.body.username },
      { $setOnInsert: { username: req.body.username } },
      { upsert: true, new: true }
    );
    res.status(user.isNew ? 201 : 200).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Username exists' });
  }
});

app.get('/user/:username/questions', async (req, res) => {
  const questions = await Question.find({ username: req.params.username });
  res.json(questions);
});

app.post('/questions', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) throw new Error('User not found');
      const question = new Question(req.body);
      await question.save();
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({ error: 'Invalid user or data' });
    }
  });
  
  app.get('/questions', async (req, res) => {
    const questions = await Question.find(req.query.username ? { username: req.query.username } : {});
    res.json(questions);
  });
  
  app.get('/questions/:id', async (req, res) => {
    const question = await Question.findById(req.params.id);
    res.json(question);
  });

  app.post('/questions/:id/answers', async (req, res) => {
    try {
      const { username, answer } = req.body;
  
      // Validate input
      if (!username || !answer) {
        return res.status(400).json({ error: 'Username and answer are required' });
      }
  
      // Check if the user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the question by ID
      const question = await Question.findById(req.params.id);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      // Add the answer to the question
      question.answers.push({ username, answer });
      await question.save();
  
      res.status(201).json(question); // Return the entire question
      
    } catch (error) {
      console.error('Error adding answer:', error);
      res.status(500).json({ error: 'Failed to add answer' });
    }
  });

app.listen(3000, () => console.log('Service running on port 3000'));