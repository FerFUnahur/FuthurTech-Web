const router = require('express').Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const { validateUpdate } = require('../middleware/userValidation.middleware');

router.get('/', authenticate, authorize('admin'), userController.getAll);
router.get('/:id', authenticate, authorize('admin'), userController.getById);
router.put('/:id', authenticate, validateUpdate, userController.update);
router.delete('/:id', authenticate, authorize('admin'), userController.remove);

module.exports = router;
