const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, orderController.getAll);
router.get('/:id', authenticate, orderController.getById);
router.post('/', authenticate, orderController.create);
router.put('/:id/status', authenticate, authorize('admin'), orderController.updateStatus);

module.exports = router;
