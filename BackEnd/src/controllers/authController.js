const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  bio: user.bio,
  birthDate: user.birthDate,
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, birthDate } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'El email ya está registrado' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || 'student', birthDate });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

exports.me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};
