const { User } = require('../models');

exports.getAll = async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(users);
};

exports.getById = async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
};

exports.update = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (req.user.role !== 'admin' && req.user.id !== user.id) {
    return res.status(403).json({ error: 'No puedes editar este usuario' });
  }
  const { name, email, avatar, bio, role } = req.body;
  await user.update({ name, email, avatar, bio, role });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio } });
};

exports.remove = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  await user.destroy();
  res.json({ message: 'Usuario eliminado' });
};
