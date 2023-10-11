import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'gather'
createGathers()
export const gatherService = {
    query,
    getById,
    save,
    remove,
    getEmptyGather,
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
    var savedGather
    if (gather._id) {
        savedGather = await storageService.put(STORAGE_KEY, gather)
    } else {
        // Later, owner is set by the backend
        // gather.owner = userService.getLoggedinUser()
        savedGather = await storageService.post(STORAGE_KEY, gather)

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
function createGathers() {
    let gathers = utilService.loadFromStorage(STORAGE_KEY)
    if (!gathers || !gathers.length) {
        gathers = [{
            _id: "1001",
            title: "Holiday party",
            description: "Best party ever",
            location: "Gibson park",
            myDate: new Date('2023-05-30'),
            myTime: new Date(`May 30, 2000 17:00:00`),
            guestsInvited: [{ _id: "102", fullname: "John Doe" }, { _id: "103", fullname: "Carol Sing" }],
            itemToBring: [{ _id: '300', item: 'Banana', isDone: true, itemOnwer: { _id: '104', fullname: "Matt Lon", imgUrl: 'https://cdn.pixabay.com/photo/2012/04/13/21/07/user-33638_960_720.png' } }, { _id: '301', item: 'Apple', isDone: true, itemOnwer: { _id: '106', fullname: "SaM Ban", imgUrl: 'https://cdn.pixabay.com/photo/2014/04/03/10/41/person-311134_960_720.png' } }],
            guestsApproved: [{ _id: "104", fullname: "Matt Lon", imgUrl: 'https://cdn.pixabay.com/photo/2012/04/13/21/07/user-33638_960_720.png' }, { _id: '106', fullname: "SaM Ban", imgUrl: 'https://cdn.pixabay.com/photo/2014/04/03/10/41/person-311134_960_720.png' }],
            adminOfGather: [{ _id: "106", fullname: "SaM Ban" }],
            MapLocation: { lat: '40', lng: '80' },
            owner: { _id: "106", fullname: "SaM Ban" },
            chatHistory: [{ _id: '42', txt: 'hello', from: { _id: "108", fullname: "Batt Mon", imgUrl: 'https://cdn.pixabay.com/photo/2014/03/25/16/54/user-297566_960_720.png' } }]
        }, {
            _id: "1002",
            title: "Moms Meeting",
            description: "Best party ever",
            location: "Gibson park",
            myDate: new Date('2023-05-29'),
            myTime: new Date(`May 29, 2000 16:00:00`),
            guestsInvited: [{ _id: "107", fullname: "Soll Del" }, { _id: "103", fullname: "Carol Sing" }],
            itemToBring: [{ _id: '302', item: 'Phone', isDone: true, itemOnwer: { _id: "108", fullname: "Batt Mon", imgUrl: 'https://cdn.pixabay.com/photo/2014/03/25/16/54/user-297566_960_720.png' } }, { _id: '303', item: 'Chair', isDone: true, itemOnwer: { _id: "105", fullname: "Amanda Bird", imgUrl: 'https://cdn.pixabay.com/photo/2013/07/12/14/36/man-148582_960_720.png' } }],
            guestsApproved: [{ _id: "108", fullname: "Batt Mon", imgUrl: 'https://cdn.pixabay.com/photo/2014/03/25/16/54/user-297566_960_720.png' }, { _id: "105", fullname: "Amanda Bird", imgUrl: 'https://cdn.pixabay.com/photo/2013/07/12/14/36/man-148582_960_720.png' }],
            adminOfGather: [{ _id: "109", fullname: "Samnta Can" }],
            MapLocation: { lat: '50', lng: '90' },
            owner: { _id: "109", fullname: "Samnta Can" },
            chatHistory: [{ _id: '41', txt: 'hello', from: { _id: "108", fullname: "Batt Mon", imgUrl: 'https://cdn.pixabay.com/photo/2014/03/25/16/54/user-297566_960_720.png' } }]
        }
        ]
        utilService.saveToStorage(STORAGE_KEY, gathers)
    }
}

// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 980}).then(x => console.log(x))




// {
//     "title": "Moms Meeting",
//     "description": "Best party ever",
//     "location": "Gibson park",
//     "myDate": "2023-05-29",
//     "myTime":"May 29, 2000 16:00:00",
//     "guestsInvited": [{ "_id": "107", "fullname": "Soll Del" }, { "_id": "103", "fullname": "Carol Sing" }],
//     "itemToBring": [{ "_id": "302", "item": "Phone", "isDone": "true", "itemOnwer": { "_id": "108", "fullname": "Batt Mon", "imgUrl": "https://cdn.pixabay.com/photo/2014/03/25/16/54/user-297566_960_720.png" } }, { "_id": "303", "item": "Chair", "isDone": "true", "itemOnwer": { "_id": "105", "fullname": "Amanda Bird", "imgUrl": "https://cdn.pixabay.com/photo/2013/07/12/14/36/man-148582_960_720.png" } }],
//     "guestsApproved": [{ "_id": "108", "fullname": "Batt Mon", "imgUrl": "https://cdn.pixabay.com/photo/2014/03/25/16/54/user-297566_960_720.png" }, { "_id": "105", "fullname": "Amanda Bird", "imgUrl": "https://cdn.pixabay.com/photo/2013/07/12/14/36/man-148582_960_720.png" }],
//     "adminOfGather": [{ "_id": "109", "fullname": "Samnta Can" }],
//     "MapLocation": { "lat": "50", "lng": "90" },
//     "owner": { "_id": "109", "fullname": "Samnta Can" },
//     "chatHistory": [{" _id": "41", "txt": "hello", "from": { "_id": "108", "fullname": "Batt Mon", "imgUrl": "https://cdn.pixabay.com/photo/2014/03/25/16/54/user-297566_960_720.png" } }]
// }