const express = require('express');
const authMiddleware = require('../../middleware/auth');
const requireRole = require('../../middleware/role');
const { getAll, getOne, create, update, remove } = require('./destinations.controller');

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', authMiddleware, requireRole(['admin', 'super_admin']), create);
router.put('/:id', authMiddleware, requireRole(['admin', 'super_admin']), update);
router.delete('/:id', authMiddleware, requireRole(['admin', 'super_admin']), remove);

module.exports = router;
