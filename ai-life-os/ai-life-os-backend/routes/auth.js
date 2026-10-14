const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');
const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const user = await User.create({ name, email, password });
    console.log(`✅ New user registered: ${email}`);
    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid email or password' });

    console.log(`✅ User logged in: ${email}`);
    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ME
router.get('/me', protect, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    settings: req.user.settings,
  });
});

// UPDATE PROFILE
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, 'settings.currency': req.body.currency },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CHANGE PASSWORD
router.put('/password', protect, async (req, res) => {
  const { current, newPassword } = req.body;
  if (!current || !newPassword)
    return res.status(400).json({ error: 'Both fields required' });

  try {
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(current)))
      return res.status(400).json({ error: 'Current password incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: '✅ Password updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;