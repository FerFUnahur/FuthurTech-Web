const router = require('express').Router();
const moduleController = require('../controllers/moduleController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/:courseId/modules', authenticate, authorize('admin', 'instructor'), moduleController.create);
router.put('/modules/:id', authenticate, authorize('admin', 'instructor'), moduleController.update);
router.delete('/modules/:id', authenticate, authorize('admin'), moduleController.remove);

module.exports = router;
