const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    try {
        const collection = await dbService.getCollection('gather')
        var gathers = await collection.find().toArray()
        return gathers
    } catch (err) {
        logger.error('cannot find gathers', err)
        throw err
    }
}

async function getById(gatherId) {
    try {
        const collection = await dbService.getCollection('gather')
        const gather = collection.findOne({ _id: ObjectId(gatherId) })
        return gather
    } catch (err) {
        logger.error(`while finding gather ${gatherId}`, err)
        throw err
    }
}

async function remove(gatherId) {
    try {
        const collection = await dbService.getCollection('gather')
        await collection.deleteOne({ _id: ObjectId(gatherId) })
        return gatherId
    } catch (err) {
        logger.error(`cannot remove gather ${gatherId}`, err)
        throw err
    }
}

async function add(gather) {
    try {
        const collection = await dbService.getCollection('gather')
        await collection.insertOne(gather)
        return gather
    } catch (err) {
        logger.error('cannot insert gather', err)
        throw err
    }
}

async function update(gather) {
    try {
        const gatherToSave = {
            title: gather.title,
            description: gather.description,
            location: gather.location,
            myDate: gather.myDate,
            myTime: gather.myTime,
            guestsInvited: gather.guestsInvited,
            itemToBring: gather.itemToBring,
            guestsApproved: gather.guestsApproved,
            adminOfGather: gather.adminOfGather,
            MapLocation: gather.MapLocation,
            owner: gather.owner,
            chatHistory: gather.chatHistory

        }
        const collection = await dbService.getCollection('gather')
        await collection.updateOne({ _id: ObjectId(gather._id) }, { $set: gatherToSave })
        return gather
    } catch (err) {
        logger.error(`cannot update gather ${gather._id}`, err)
        throw err
    }
}



module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    // addGatherMsg,
    // removeGatherMsg
}
