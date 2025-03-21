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
      const user = await User.findOne({ username: req.body.username });
      if (!user) throw new Error('User not found');
      const question = await Question.findById(req.params.id);
      question.answers.push(req.body);
      await question.save();
      res.status(201).json(question.answers.slice(-1)[0]);
    } catch (error) {
      res.status(400).json({ error: 'Invalid user or data' });
    }
  });

app.listen(3000, () => console.log('Service running on port 3000'));