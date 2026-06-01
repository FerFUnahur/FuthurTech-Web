const router = require('express').Router();
const lessonController = require('../controllers/lessonController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/modules/:moduleId/lessons', authenticate, authorize('admin', 'instructor'), lessonController.create);
router.put('/lessons/:id', authenticate, authorize('admin', 'instructor'), lessonController.update);
router.delete('/lessons/:id', authenticate, authorize('admin'), lessonController.remove);

module.exports = router;
