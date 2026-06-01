const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const {
  User, Category, Product, Course, Module, Lesson,
  Enrollment, LessonProgress, Certificate
} = require('../models');

const seed = async () => {
  await sequelize.sync({ force: true });

  const hash = await bcrypt.hash('123456', 10);

  const admin = await User.create({ name: 'Admin FuthurTech', email: 'admin@futhurtech.com', password: hash, role: 'admin', bio: 'Administrador de la plataforma' });
  const instructor = await User.create({ name: 'Carlos Gómez', email: 'instructor@futhurtech.com', password: hash, role: 'instructor', bio: 'Ingeniero en robótica con 10 años de experiencia' });
  const student = await User.create({ name: 'María López', email: 'student@futhurtech.com', password: hash, role: 'student', bio: 'Estudiante apasionada por la tecnología' });

  const catKits = await Category.create({ name: 'Kits de Robótica', description: 'Kits para aprender robótica desde cero', image: '' });
  const catAcc = await Category.create({ name: 'Accesorios', description: 'Accesorios y componentes electrónicos', image: '' });
  const catLibros = await Category.create({ name: 'Libros', description: 'Libros de programación y robótica', image: '' });

  await Product.create({ name: 'Kit Robótica Iniciación', description: 'Kit básico con Arduino Uno, sensores y LEDs', price: 8000, stock: 20, categoryId: catKits.id, image: '' });
  await Product.create({ name: 'Kit Robótica Intermedio', description: 'Kit con Arduino Mega, servomotores y pantalla LCD', price: 15000, stock: 15, categoryId: catKits.id, image: '' });
  await Product.create({ name: 'Kit Robótica Avanzado', description: 'Kit profesional con Raspberry Pi, cámaras y brazos robóticos', price: 25000, stock: 10, categoryId: catKits.id, image: '' });
  await Product.create({ name: 'Sensor Ultrasónico HC-SR04', description: 'Sensor de distancia ultrasónico para proyectos', price: 1200, stock: 50, categoryId: catAcc.id, image: '' });
  await Product.create({ name: 'Servomotor SG90', description: 'Micro servomotor para proyectos de robótica', price: 2500, stock: 30, categoryId: catAcc.id, image: '' });
  await Product.create({ name: 'Libro: Programación con Python', description: 'Introducción a la programación con Python', price: 5000, stock: 25, categoryId: catLibros.id, image: '' });

  const catCourseRobotica = await Category.create({ name: 'Robótica', description: 'Cursos de robótica educativa', image: '' });
  const catCourseProg = await Category.create({ name: 'Programación', description: 'Cursos de programación', image: '' });

  const cursoRobotica = await Course.create({ title: 'Robótica Inicial', description: 'Aprendé los fundamentos de la robótica desde cero. Incluye conceptos de electrónica, programación y mecánica básica.', image: '', instructorId: instructor.id, categoryId: catCourseRobotica.id, price: 0, status: 'publicado' });
  const cursoAvanzado = await Course.create({ title: 'Robótica Avanzado', description: 'Profundizá en robótica con proyectos complejos: brazos robóticos, visión artificial y sistemas autónomos.', image: '', instructorId: instructor.id, categoryId: catCourseRobotica.id, price: 15000, status: 'publicado' });
  const cursoProg = await Course.create({ title: 'Programación para Robots', description: 'Aprendé a programar robots usando Python y C++. Desde scripts simples hasta algoritmos de navegación.', image: '', instructorId: instructor.id, categoryId: catCourseProg.id, price: 0, status: 'publicado' });

  const m1 = await Module.create({ courseId: cursoRobotica.id, title: 'Introducción a la Robótica', description: 'Conceptos fundamentales', order: 1 });
  const m2 = await Module.create({ courseId: cursoRobotica.id, title: 'Electrónica Básica', description: 'Componentes electrónicos', order: 2 });
  const m3 = await Module.create({ courseId: cursoRobotica.id, title: 'Programación con Arduino', description: 'Primeros pasos con Arduino', order: 3 });

  await Lesson.create({ moduleId: m1.id, title: '¿Qué es la robótica?', content: 'Contenido de la lección: definición, historia y aplicaciones de la robótica.', videoUrl: 'https://www.youtube.com/embed/dummy1', duration: 15, order: 1 });
  await Lesson.create({ moduleId: m1.id, title: 'Componentes de un robot', content: 'Estructura, actuadores, sensores y controladores.', videoUrl: 'https://www.youtube.com/embed/dummy2', duration: 20, order: 2 });
  await Lesson.create({ moduleId: m2.id, title: 'Circuitos básicos', content: 'Ley de Ohm, circuitos en serie y paralelo.', videoUrl: 'https://www.youtube.com/embed/dummy3', duration: 25, order: 1 });
  await Lesson.create({ moduleId: m2.id, title: 'Sensores y actuadores', content: 'Tipos de sensores y cómo funcionan los actuadores.', videoUrl: 'https://www.youtube.com/embed/dummy4', duration: 18, order: 2 });
  await Lesson.create({ moduleId: m3.id, title: 'Instalación de Arduino IDE', content: 'Descarga, instalación y configuración del entorno.', videoUrl: 'https://www.youtube.com/embed/dummy5', duration: 10, order: 1 });
  await Lesson.create({ moduleId: m3.id, title: 'Primer programa: LED parpadeante', content: 'Escribí tu primer sketch y hacé parpadear un LED.', videoUrl: 'https://www.youtube.com/embed/dummy6', duration: 20, order: 2 });

  const enrollment = await Enrollment.create({ userId: student.id, courseId: cursoRobotica.id, progress: 33, completed: false });

  const leccionesMod1 = await Lesson.findAll({ where: { moduleId: m1.id } });
  for (const lec of leccionesMod1) {
    await LessonProgress.create({ userId: student.id, lessonId: lec.id, completed: true, completedAt: new Date() });
  }

  await Certificate.create({
    userId: student.id,
    courseId: cursoProg.id,
    code: 'FTH-2026-001',
  });

  console.log('Seed completado exitosamente');
  console.log('Usuarios creados:');
  console.log('  admin@futhurtech.com / 123456 (Admin)');
  console.log('  instructor@futhurtech.com / 123456 (Instructor)');
  console.log('  student@futhurtech.com / 123456 (Student)');
};

module.exports = seed;

if (require.main === module) {
  seed().then(() => process.exit(0));
}
