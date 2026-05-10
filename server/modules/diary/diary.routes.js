const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');
const ctrl = require('./diary.controller');

router.use(protect);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', roleCheck('super_admin', 'admin'), ctrl.create);
router.put('/:id', roleCheck('super_admin', 'admin'), ctrl.update);
router.delete('/:id', roleCheck('super_admin', 'admin'), ctrl.remove);

module.exports = router;
