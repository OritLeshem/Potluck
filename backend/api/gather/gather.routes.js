const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getGathers, getGatherById, addGather, updateGather, removeGather } = require('./gather.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

// router.get('/', log, getGathers)
// router.get('/:id', getGatherById)
// router.post('/', requireAuth, addGather)
// router.put('/:id', requireAuth, updateGather)
// router.delete('/:id', requireAuth, removeGather)
// // router.delete('/:id', requireAuth, requireAdmin, removeGather)

// router.post('/:id/msg', requireAuth, addGatherMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeGatherMsg)
router.get('/', log, getGathers)
router.get('/:id', getGatherById)
router.post('/', addGather)
router.put('/:id', updateGather)
router.delete('/:id', removeGather)
// router.delete('/:id', requireAuth, requireAdmin, removeGather)



module.exports = router