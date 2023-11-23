const express = require('express')
const { requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getCodeblocks, getCodeblockById, addCodeblock, updateCodeblock, removeCodeblock } = require('./codeblock.controller.js')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getCodeblocks)
router.get('/:id', getCodeblockById)
router.post('/', requireAdmin, addCodeblock)
router.put('/:id', updateCodeblock)
router.delete('/:id', requireAdmin, removeCodeblock)

module.exports = router