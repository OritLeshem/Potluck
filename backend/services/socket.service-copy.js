const logger = require('./logger.service');
// const toyService = require("../api/toy/toy.service")
var gIo = null

function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`)
        socket.on('disconnect', socket => {
            logger.info(`Socket disconnected [id: ${socket.id}]`)
        })

        // Join socket to a room
        socket.on('set-chat-topic', gatherId => {
            console.log('got new topic', gatherId);
            if (socket.gatherId === gatherId) return;
            if (socket.gatherId) {
                // When visiting another gather, remove the prev "room"
                socket.leave(socket.gatherId)
                logger.info(`Socket is leaving topic ${socket.gatherId} [id: ${socket.id}]`)
            }
            socket.join(gatherId)
            // save the toyid on this specific user socket for later use.
            socket.gatherId = gatherId
        })

        // Join socket to a room
        socket.on('chat-new-msg', msg => {
            logger.info(`New chat msg from socket [id: ${socket.id}], emitting to topic ${socket.gatherId}`)
            gIo.to(socket.gatherId).emit('chat-add-msg', msg)
        })

        socket.on('chat-user-typing', user => {
            logger.info(`User is typing from socket [id: ${socket.id}], emitting to topic ${socket.gatherId}`)
            socket.broadcast.to(socket.gatherId).emit('chat-add-typing', user)
            // broadcast({ type: 'chat typing', data: user, room: socket.gatherId, userId: socket.userId })
        })

        socket.on('chat-stop-typing', user => {
            logger.info(`User has stopped typing from socket [id: ${socket.id}], emitting to topic ${socket.gatherId}`)
            socket.broadcast.to(socket.gatherId).emit('chat-remove-typing', user)
            // broadcast({ type: 'chat stop-typing', data: user, room: socket.gatherId, userId: socket.userId })
        })


        // For specific user
        socket.on('user-watch', userId => {
            logger.info(`user-watch from socket [id: ${socket.id}], on user ${userId}`)
            socket.join('watching:' + userId)
        })

        socket.on('set-user-socket', userId => {
            logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
            socket.userId = userId
        })

        socket.on('unset-user-socket', () => {
            logger.info(`Removing socket.userId for socket [id: ${socket.id}]`)
            delete socket.userId
        })


        //item
        socket.on('set-gather-item-topic', gather => {
            console.log(' **********set-gather-item-topic', gather._id);
            if (socket.gatherIdItems === gather._id) return;
            if (socket.gatherIdItems) {
                socket.leave(socket.gatherIdItems);
                logger.info(`Socket is leaving topic ${socket.gatherIdItems} [id: ${socket.id}]`);
            }
            socket.join(gather._id);
            socket.gatherIdItems = gather._id;
            console.log('socket.gatherIdItems:', socket.gatherIdItems); // Add this line
            logger.info(`joined ${gather._id} socket id: ${socket.id}], emitting to topic ${socket.gatherIdItems}`);
        });

        socket.on('gather-new-item', item => {
            console.log('gather-new-item:', item);
            console.log('socket.gatherIdItems:', socket.gatherIdItems);
            logger.info(`New item ${item.item} from socket [id: ${socket.id}], emitting to topic ${socket.gatherIdItems}`);
            gIo.to(socket.gatherIdItems).emit('gather-add-item', item);
        });
    }
    )


}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
    userId = userId.toString()
    const socket = await _getUserSocket(userId)

    if (socket) {
        logger.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    } else {
        logger.info(`No active socket for user: ${userId}`)
        // _printSockets();
    }
}

// If possible, send to all sockets BUT not the current socket 
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
    logger.info(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket;
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets();
    return sockets;
}

async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}
