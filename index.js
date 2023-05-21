
const express = require('express');
const mongoose = require('mongoose');


const app = express();
const PORT = 3001;


mongoose.connect('mongodb://localhost/social_network_db', {
});
const db = mongoose.connection;




const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const User = mongoose.model('User', userSchema);


const thoughtSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thoughtText: { type: String, required: true },
 
  reactions: [{ type: String }], 
});

const Thought = mongoose.model('Thought', thoughtSchema);


db.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});




app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/users', async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = new User({ username, email });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});


app.post('/thoughts', async (req, res) => {
  try {
    const { userId, thoughtText } = req.body;
    const thought = new Thought({ userId, thoughtText });
    await thought.save();
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});


app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(id, { username, email }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndRemove(id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});


app.delete('/thoughts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Thought.findByIdAndRemove(id);
    res.json({ message: 'Thought deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

app.post('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    user.friends.push(friend);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

app.delete('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findById(userId);
    const friendIndex = user.friends.indexOf(friendId);
    if (friendIndex > -1) {
      user.friends.splice(friendIndex, 1);
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

