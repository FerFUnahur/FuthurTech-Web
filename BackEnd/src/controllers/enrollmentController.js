const { v4: uuidv4 } = require('uuid');
const { Enrollment, LessonProgress, Course, Module, Lesson, Certificate } = require('../models');

exports.enroll = async (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ error: 'Los administradores no pueden inscribirse a cursos' });
  }
  const course = await Course.findByPk(req.params.courseId);
  if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
  if (req.body.accessCode !== course.accessCode) {
    return res.status(403).json({ error: 'Código de acceso inválido' });
  }
  const exists = await Enrollment.findOne({ where: { userId: req.user.id, courseId: req.params.courseId } });
  if (exists) return res.status(400).json({ error: 'Ya estás inscrito en este curso' });
  const enrollment = await Enrollment.create({ userId: req.user.id, courseId: req.params.courseId });
  res.status(201).json(enrollment);
};

exports.getMyEnrollments = async (req, res) => {
  const enrollments = await Enrollment.findAll({
    where: { userId: req.user.id },
    include: [{ model: Course, include: [{ model: Module, include: [Lesson] }] }],
  });
  res.json(enrollments);
};

exports.getProgress = async (req, res) => {
  const enrollment = await Enrollment.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [{ model: Course, include: [{ model: Module, include: [Lesson] }] }],
  });
  if (!enrollment) return res.status(404).json({ error: 'Inscripción no encontrada' });
  const lessonProgress = await LessonProgress.findAll({
    where: { userId: req.user.id, lessonId: enrollment.Course.Modules.flatMap(m => m.Lessons).map(l => l.id) },
  });
  res.json({ enrollment, lessonProgress });
};

exports.updateLastLesson = async (req, res) => {
  const enrollment = await Enrollment.findOne({
    where: { userId: req.user.id, courseId: req.params.courseId }
  });
  if (!enrollment) return res.status(404).json({ error: 'Inscripción no encontrada' });
  await enrollment.update({ lastLessonId: req.body.lessonId });
  res.json(enrollment);
};

exports.markLesson = async (req, res) => {
  const lesson = await Lesson.findByPk(req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lección no encontrada' });
  const [progress, created] = await LessonProgress.findOrCreate({
    where: { userId: req.user.id, lessonId: req.params.lessonId },
    defaults: { completed: true, completedAt: new Date() },
  });
  if (!created && !progress.completed) {
    await progress.update({ completed: true, completedAt: new Date() });
  }
  const mod = await Module.findByPk(lesson.moduleId);
  if (mod) {
    const enrollment = await Enrollment.findOne({
      where: { userId: req.user.id, courseId: mod.courseId },
      include: [{ model: Course, include: [{ model: Module, include: [Lesson] }] }],
    });
    if (enrollment) {
      const allLessons = enrollment.Course.Modules.flatMap(m => m.Lessons);
      const completedLessons = await LessonProgress.count({
        where: { userId: req.user.id, lessonId: allLessons.map(l => l.id), completed: true },
      });
      const progressPct = allLessons.length > 0 ? Math.round((completedLessons / allLessons.length) * 100) : 0;
      await enrollment.update({ progress: progressPct, completed: progressPct === 100 });
      if (progressPct === 100) {
        const certExists = await Certificate.findOne({ where: { userId: req.user.id, courseId: enrollment.courseId } });
        if (!certExists) {
          const code = uuidv4().slice(0, 8).toUpperCase();
          await Certificate.create({ userId: req.user.id, courseId: enrollment.courseId, code });
        }
      }
    }
  }
  res.json(progress);
};
