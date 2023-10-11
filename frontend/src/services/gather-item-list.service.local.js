import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'item-list'
createGathers()
export const gatherItemListService = {
    query,
    getById,
    save,
    remove,
    getEmptyGatherItemList,
    addGatherMsg
}


async function query(filterBy = { txt: '', price: 0 }) {
    var gathers = await storageService.query(STORAGE_KEY)
    // if (filterBy.txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     gathers = gathers.filter(gather => regex.test(gather.vendor) || regex.test(gather.description))
    // }
    // if (filterBy.price) {
    //     gathers = gathers.filter(gather => gather.price <= filterBy.price)
    // }
    return gathers
}

function getById(gatherId) {
    return storageService.get(STORAGE_KEY, gatherId)
}

async function remove(gatherId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, gatherId)
}

async function save(gather) {
    console.log("gather", gather)
    var savedGather
    if (gather._id) {
        savedGather = await storageService.put(STORAGE_KEY, gather)
    } else {
        console.log("savedGather add1", savedGather)

        // Later, owner is set by the backend
        // gather.owner = userService.getLoggedinUser()
        savedGather = await storageService.post(STORAGE_KEY, gather)
        console.log("savedGather add2", savedGather)

    }
    return savedGather
}

async function addGatherMsg(gatherId, txt) {
    // Later, this is all done by the backend
    const gather = await getById(gatherId)
    if (!gather.msgs) gather.msgs = []

    const msg = {
        id: utilService.makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    gather.msgs.push(msg)
    await storageService.put(STORAGE_KEY, gather)

    return msg
}

function getEmptyGatherItemList(title = '') {
    return {
        title,

    }
}
function createGathers() {
    let gathers = utilService.loadFromStorage(STORAGE_KEY)
    if (!gathers || !gathers.length) {
        gathers = [{
            _id: "300",
            title: "Banana",
            itemOnwer: { _id: "108", fullname: "Batt Mon" },
        }, {
            _id: "1002",
            title: "Moms Meeting",
            description: "Best party ever",
            location: "Gibson park",
            myDate: new Date('2023-05-29'),
            myTime: new Date(`May 29, 2000 16:00:00`),
            guestsInvited: [{ _id: "107", fullname: "Soll Del" }, { _id: "103", fullname: "Carol Sing" }],
            itemToBring: [{ _id: '302', item: 'Phone', itemOnwer: { _id: "108", fullname: "Batt Mon" } }, { _id: '303', item: 'Chair', itemOnwer: { _id: "105", fullname: "Amanda Bird" } }],

            guestsApproved: [{ _id: "108", fullname: "Batt Mon" }, { _id: "105", fullname: "Amanda Bird" }],
            adminOfGather: [{ _id: "109", fullname: "Samnta Can" }],
            MapLocation: { lat: '50', lng: '90' },
            owner: { _id: "109", fullname: "Samnta Can" }
        }
        ]
        utilService.saveToStorage(STORAGE_KEY, gathers)
    }
}

// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 980}).then(x => console.log(x))




