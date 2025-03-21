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

app.listen(3000, () => console.log('Service running on port 3000'));