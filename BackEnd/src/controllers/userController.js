const { User } = require('../models');

exports.getAll = async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password', 'phone', 'city', 'province'] } });
  res.json(users);
};

exports.getById = async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password', 'phone', 'city', 'province'] } });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
};

exports.update = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  
  // Solo el admin de la propia sesión y el usuario propietario pueden editar
  if (req.user.id !== user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No puedes editar este usuario' });
  }

  const { name, email, avatar, bio, birthDate, role } = req.body;
  const updates = {};

  // Los usuarios solo pueden editar sus propios datos (excepto rol y email)
  if (req.user.id === user.id) {
    // Usuario editando su propio perfil - puede editar todo excepto email y rol
    if (name !== undefined) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (bio !== undefined) updates.bio = bio;
    if (birthDate !== undefined) updates.birthDate = birthDate || null;
  } else if (req.user.role === 'admin') {
    // Admin editando a otro usuario - solo puede cambiar rol
    if (role !== undefined) updates.role = role;
  } else {
    return res.status(403).json({ error: 'No tienes permisos para editar este usuario' });
  }

  await user.update(updates);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      birthDate: user.birthDate,
    },
  });
};

exports.remove = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  await user.destroy();
  res.json({ message: 'Usuario eliminado' });
};
