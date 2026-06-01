const router = require('express').Router();
const certificateController = require('../controllers/certificateController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, certificateController.getMyCertificates);
router.get('/all', authenticate, authorize('admin'), certificateController.getAll);
router.get('/:id/download', authenticate, certificateController.downloadPDF);

module.exports = router;
