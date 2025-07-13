const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/stacktalk');

// User Schema and Model
const userSchema = new mongoose.Schema({ 
  username: { type: String, unique: true, required: true, trim: true } 
});
const User = mongoose.model('User', userSchema);

// Question Schema and Model
const answerSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true, trim: true },
  answers: [answerSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
questionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Question = mongoose.model('Question', questionSchema);

// User Routes
app.post('/user', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const trimmedUsername = username.trim();
    
    // Check if username already exists
    const existingUser = await User.findOne({ username: trimmedUsername });
    if (existingUser) {
      return res.status(200).json(existingUser); // Return existing user
    }

    // Create new user
    const user = new User({ username: trimmedUsername });
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/user/:username/questions', async (req, res) => {
  try {
    const { username } = req.params;
    const questions = await Question.find({ username })
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching user questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Question Routes
app.post('/questions', async (req, res) => {
  try {
    const { username, title, body } = req.body;

    // Validate input
    if (!username || !title || !body) {
      return res.status(400).json({ error: 'Username, title, and body are required' });
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create new question
    const question = new Question({
      username: username.trim(),
      title: title.trim(),
      body: body.trim()
    });
    
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

app.get('/questions', async (req, res) => {
  try {
    const { username } = req.query;
    let query = {};
    
    if (username) {
      query.username = username;
    }
    
    const questions = await Question.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

app.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

app.post('/questions/:id/answers', async (req, res) => {
  try {
    const { username, answer } = req.body;
    const { id } = req.params;

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
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Add the answer to the question
    question.answers.push({ 
      username: username.trim(), 
      answer: answer.trim() 
    });
    await question.save();

    res.status(201).json(question);
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).json({ error: 'Failed to add answer' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`StackTalk API running on port ${PORT}`));