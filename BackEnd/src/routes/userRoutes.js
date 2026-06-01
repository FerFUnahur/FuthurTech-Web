const router = require('express').Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('admin'), userController.getAll);
router.get('/:id', authenticate, authorize('admin'), userController.getById);
router.put('/:id', authenticate, userController.update);
router.delete('/:id', authenticate, authorize('admin'), userController.remove);

module.exports = router;
