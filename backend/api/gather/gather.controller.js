const gatherService = require('./gather.service.js')

const logger = require('../../services/logger.service')

async function getGathers(req, res) {
  try {
    logger.debug('Getting Gathers')
    // const filterBy = {
    //   txt: req.query.txt || ''
    // }
    // const gathers = await gatherService.query(filterBy)
    const gathers = await gatherService.query()

    res.json(gathers)
  } catch (err) {
    logger.error('Failed to get gathers', err)
    res.status(500).send({ err: 'Failed to get gathers' })
  }
}

async function getGatherById(req, res) {
  try {
    const gatherId = req.params.id
    const gather = await gatherService.getById(gatherId)
    res.json(gather)
  } catch (err) {
    logger.error('Failed to get gather', err)
    res.status(500).send({ err: 'Failed to get gather' })
  }
}

async function addGather(req, res) {
  const { loggedinUser } = req

  try {
    const gather = req.body
    // gather.owner = loggedinUser
    const addedGather = await gatherService.add(gather)
    res.json(addedGather)
  } catch (err) {
    logger.error('Failed to add gather', err)
    res.status(500).send({ err: 'Failed to add gather' })
  }
}


async function updateGather(req, res) {
  try {
    const gather = req.body
    const updatedGather = await gatherService.update(gather)
    res.json(updatedGather)
  } catch (err) {
    logger.error('Failed to update gather', err)
    res.status(500).send({ err: 'Failed to update gather' })

  }
}

async function removeGather(req, res) {
  try {
    const gatherId = req.params.id
    const removedId = await gatherService.remove(gatherId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove gather', err)
    res.status(500).send({ err: 'Failed to remove gather' })
  }
}

async function addGatherMsg(req, res) {
  const { loggedinUser } = req
  try {
    const gatherId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await gatherService.addGatherMsg(gatherId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update gather', err)
    res.status(500).send({ err: 'Failed to update gather' })

  }
}

async function removeGatherMsg(req, res) {
  const { loggedinUser } = req
  try {
    const gatherId = req.params.id
    const { msgId } = req.params

    const removedId = await gatherService.removeGatherMsg(gatherId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove gather msg', err)
    res.status(500).send({ err: 'Failed to remove gather msg' })

  }
}

module.exports = {
  getGathers,
  getGatherById,
  addGather,
  updateGather,
  removeGather,
  addGatherMsg,
  removeGatherMsg
}
