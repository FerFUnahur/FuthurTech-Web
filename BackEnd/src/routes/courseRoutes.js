const router = require('express').Router();
const courseController = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', courseController.getAll);
router.get('/categories', courseController.getCategories);
router.get('/:id', courseController.getById);
router.post('/', authenticate, authorize('admin', 'instructor'), courseController.create);
router.put('/:id', authenticate, authorize('admin', 'instructor'), courseController.update);
router.delete('/:id', authenticate, authorize('admin'), courseController.remove);
router.get('/:id/students', authenticate, authorize('admin', 'instructor'), courseController.getStudents);

module.exports = router;
