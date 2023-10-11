// import { gatherService } from '../../services/gather.service.local.js'
import { gatherService } from '../../services/gather.service.js'

import { userService } from "../../services/user.service.js";
import { store } from '../../store/store.js'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'
import { ADD_GATHER, REMOVE_ITEM_FROM_GATHER, ADD_ITEM_TO_GATHER, REMOVE_GATHER, SET_GATHERS, SET_GATHER, UNDO_REMOVE_GATHER, UPDATE_GATHER, UPDATE_ITEM_TO_GATHER, ADD_USER_TO_APPROVED_GUEST, REMOVE_USER_FROM_APPROVED_GUEST, ADD_MSG_TO_CHATHISTORY } from "../gather/gather.reducer.js";

// Action Creators:
export function getActionRemoveGather(gatherId) {
  return {
    type: REMOVE_GATHER,
    gatherId
  }
}
export function getActionAddGather(gather) {
  return {
    type: ADD_GATHER,
    gather
  }
}
export function getActionUpdateGather(gather) {
  return {
    type: UPDATE_GATHER,
    gather
  }
}

export async function loadGathers() {
  try {
    const gathers = await gatherService.query()
    store.dispatch({
      type: SET_GATHERS,
      gathers
    })

  } catch (err) {
    console.log('Cannot load gathers', err)
    throw err
  }

}
export async function loadGather(gatherId) {
  try {
    const gather = await gatherService.getById(gatherId);
    store.dispatch({ type: SET_GATHER, gather })
  } catch (err) {
    showErrorMsg('Cannot load gather')
    console.log('Cannot load gather', err)
  }
}
export async function removeGather(gatherId) {
  try {
    await gatherService.remove(gatherId)
    store.dispatch(getActionRemoveGather(gatherId))
  } catch (err) {
    console.log('Cannot remove gather', err)
    throw err
  }
}

// export async function removeItem(gatherId, itemId) {
//   console.log('removeItem action dispatched', gatherId, itemId);

//   try {
//     const gather = await gatherService.getById(gatherId);
//     const updatedItemToBring = [...gather.itemToBring]; // Create a shallow copy of the array
//     const idx = updatedItemToBring.findIndex(item => item._id === itemId);
//     if (idx < 0) throw new Error(`Remove failed, cannot find itemId with id: ${itemId} in: ${gatherId}`);
//     updatedItemToBring.splice(idx, 1);

//     const updatedGather = { ...gather, itemToBring: updatedItemToBring };
//     const savedGather = await gatherService.save(updatedGather);

//     store.dispatch(getActionUpdateGather(savedGather));
//     return savedGather;
//   } catch (err) {
//     console.log('Cannot remove gather', err);
//     throw err;
//   }
// }
export async function removeItem(gatherId, itemId) {
  try {
    let gather = await gatherService.getById(gatherId)
    let removedItem = gather.itemToBring.filter(item => item._id !== itemId)
    gather = { ...gather, itemToBring: removedItem }
    await gatherService.save(gather)
    store.dispatch(getActionRemoveItemFromGather(gather))
  } catch (err) {
    console.log('Cannot remove playlist', err)
    throw err
  }
}
export function getActionRemoveItemFromGather(gather, itemId) {
  return { type: REMOVE_ITEM_FROM_GATHER, gather }
}

export async function addGather(gather) {
  try {
    const savedGather = await gatherService.save(gather)
    console.log('Added Gather', savedGather)
    store.dispatch(getActionAddGather(savedGather))
    return savedGather
  } catch (err) {
    console.log('Cannot add gather', err)
    throw err
  }
}

export function updateGather(gather) {
  return gatherService.save(gather)
    .then(savedGather => {
      console.log('Updated Gather:', savedGather)
      store.dispatch(getActionUpdateGather(savedGather))
      return savedGather
    })
    .catch(err => {
      console.log('Cannot save gather', err)
      throw err
    })
}

export async function addItemToGather(gatherId, newItem) {
  console.log('newItem', newItem)
  try {
    let newGather = await gatherService.getById(gatherId)
    newGather = { ...newGather, itemToBring: [...newGather.itemToBring, newItem] }
    const savedGather = await gatherService.save(newGather)
    store.dispatch({ type: ADD_ITEM_TO_GATHER, gather: savedGather })
    return savedGather
  } catch (err) {
    console.log('Cannot add item:', newItem, 'to gahter:', gatherId, err)
    throw err
  }
}
export async function updateItemToGather(gatherId, newItem) {
  try {
    console.log(newItem)
    let newGather = await gatherService.getById(gatherId)
    const newItemList = newGather.itemToBring.map(item => {
      if (item._id === newItem._id) {
        console.log(item.isDone)
        return newItem;
      }
      return item;
    });
    newGather = { ...newGather, itemToBring: newItemList }
    const savedGather = await gatherService.save(newGather)
    console.log('updeted gather', savedGather)
    store.dispatch({ type: UPDATE_ITEM_TO_GATHER, gather: savedGather })
    return savedGather
  } catch (err) {
    console.log('Cannot add item:', newItem, 'to gather:', gatherId, err)
    throw err
  }
}




// Demo for Optimistic Mutation 
// (IOW - Assuming the server call will work, so updating the UI first)
export function onRemoveGatherOptimistic(gatherId) {
  store.dispatch({
    type: REMOVE_GATHER,
    gatherId
  })
  showSuccessMsg('Gather removed')

  gatherService.remove(gatherId)
    .then(() => {
      console.log('Server Reported - Deleted Succesfully');
    })
    .catch(err => {
      showErrorMsg('Cannot remove gather')
      console.log('Cannot load gathers', err)
      store.dispatch({
        type: UNDO_REMOVE_GATHER,
      })
    })
}
export async function addUserToApprovedGuest(gatherId, newUser) {
  try {
    let newGather = await gatherService.getById(gatherId)
    newGather = { ...newGather, guestsApproved: [...newGather.guestsApproved, newUser] }
    const savedGather = await gatherService.save(newGather)
    store.dispatch({ type: ADD_USER_TO_APPROVED_GUEST, gather: savedGather })
    return savedGather
  } catch (err) {
    console.log('Cannot add user:', newUser, 'to gahter approved guest list, gatherId:', gatherId, err)
    throw err
  }
}
export async function removeUserFromApprovedGuest(gatherId, guestId) {
  try {
    let gather = await gatherService.getById(gatherId)
    let removedGuest = gather.guestsApproved.filter(guest => guest._id !== guestId)
    gather = { ...gather, guestsApproved: removedGuest }
    await gatherService.save(gather)
    store.dispatch({ type: REMOVE_USER_FROM_APPROVED_GUEST, gather: gather })
  } catch (err) {
    console.log('Cannot remove playlist', err)
    throw err
  }
}
export async function addMsgToChatHistory(gatherId, newMsg) {
  try {
    let newGather = await gatherService.getById(gatherId)
    newGather = { ...newGather, chatHistory: [...newGather.chatHistory, newMsg] }
    const savedGather = await gatherService.save(newGather)
    store.dispatch({ type: ADD_MSG_TO_CHATHISTORY, gather: savedGather })
    return savedGather
  } catch (err) {
    console.log('Cannot add msg:', newMsg, 'to gahter:', gatherId, err)
    throw err
  }
}