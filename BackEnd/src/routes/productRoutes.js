const router = require('express').Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authenticate, authorize('admin'), productController.create);
router.put('/:id', authenticate, authorize('admin'), productController.update);
router.delete('/:id', authenticate, authorize('admin'), productController.remove);

module.exports = router;
