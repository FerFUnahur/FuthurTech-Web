const router = require('express').Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');

router.post('/courses/:courseId/enroll', authenticate, enrollmentController.enroll);
router.get('/enrollments', authenticate, enrollmentController.getMyEnrollments);
router.get('/enrollments/:id/progress', authenticate, enrollmentController.getProgress);
router.post('/lessons/:lessonId/progress', authenticate, enrollmentController.markLesson);
router.put('/courses/:courseId/last-lesson', authenticate, enrollmentController.updateLastLesson);

module.exports = router;
