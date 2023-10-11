import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { httpService } from './http.service.js'

const STORAGE_KEY = 'gather'
export const gatherService = {
    query,
    getById,
    save,
    remove,
    getEmptyGather,
}


async function query() {
    return httpService.get(STORAGE_KEY)
}

function getById(gatherId) {
    return httpService.get(`gather/${gatherId}`)
}

async function remove(gatherId) {
    // await storageService.remove(STORAGE_KEY, carId)
    return httpService.delete(`gather/${gatherId}`)
}


async function save(gather) {
    var savedGather
    if (gather._id) {
        savedGather = await httpService.put(`gather/${gather._id}`, gather)

    } else {
        // Later, owner is set by the backend
        gather.owner = userService.getLoggedinUser()
        savedGather = await httpService.post('gather', gather)
    }
    return savedGather
}



function getEmptyGather(title = '', description = '', location = '', myDate = '', myTime = '', guestsInvited = [], guestsApproved = [], adminOfGather = [], MapLocation = { lat: '40', lng: '80' }, owner = {}, itemToBring = []) {
    return {
        title,
        description,
        location,
        myDate,
        myTime,
        guestsInvited,
        guestsApproved,
        adminOfGather,
        MapLocation,
        owner,
        itemToBring
    }
}

