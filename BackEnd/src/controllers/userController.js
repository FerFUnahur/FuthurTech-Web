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
  
  // Solo el admin de la propia sesión y el usuario propietario pueden editar
  if (req.user.id !== user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No puedes editar este usuario' });
  }

  const { role, active, name, email, avatar, bio, birthDate } = req.body;
  const updates = {};

  // Los usuarios solo pueden editar sus propios datos (excepto email)
  if (req.user.id === user.id) {
    if (name !== undefined) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (bio !== undefined) updates.bio = bio;
    if (birthDate !== undefined) updates.birthDate = birthDate || null;
    // No permitir que un admin se desactive a sí mismo
    if (active !== undefined && req.user.id === user.id && !active && req.user.role === 'admin') {
      return res.status(403).json({ error: 'No puedes desactivarte a ti mismo' });
    }
  } else if (req.user.role === 'admin') {
    if (role !== undefined) {
      // Solo un único admin permitido - no permitir crear más admins
      if (role === 'admin') {
        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount >= 1 && user.role !== 'admin') {
          return res.status(403).json({ error: 'Solo puede haber un único administrador en la plataforma' });
        }
      }
      updates.role = role;
    }
    if (active !== undefined) updates.active = active;
    // No permitir desactivar a otro admin
    if (active !== undefined && !active && user.role === 'admin' && req.user.id !== user.id) {
      return res.status(403).json({ error: 'No puedes desactivar a otro administrador' });
    }
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
      active: user.active,
    },
  });
};

exports.remove = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  await user.destroy();
  res.json({ message: 'Usuario eliminado' });
};
