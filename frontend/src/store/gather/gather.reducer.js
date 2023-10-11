export const SET_GATHERS = 'SET_GATHERS'
export const SET_GATHER = 'SET_GATHER'
export const REMOVE_GATHER = 'REMOVE_GATHER'
export const ADD_GATHER = 'ADD_GATHER'
export const UPDATE_GATHER = 'UPDATE_GATHER'
export const ADD_TO_GATHERT = 'ADD_TO_GATHERT'
export const UNDO_REMOVE_GATHER = 'UNDO_REMOVE_GATHER'
export const REMOVE_ITEM_FROM_GATHER = 'REMOVE_ITEM_FROM_GATHER'
export const ADD_ITEM_TO_GATHER = 'ADD_ITEM_TO_GATHER'
export const UPDATE_ITEM_TO_GATHER = 'UPDATE_ITEM_TO_GATHER'
export const ADD_USER_TO_APPROVED_GUEST = 'ADD_USER_TO_APPROVED_GUEST'
export const REMOVE_USER_FROM_APPROVED_GUEST = 'REMOVE_USER_FROM_APPROVED_GUEST'
export const ADD_MSG_TO_CHATHISTORY = 'ADD_MSG_TO_CHATHISTORY'
const initialState = {
  gathers: [],
  lastRemovedGather: null,
  gather: null
}

export function gatherReducer(state = initialState, action) {
  var newState = state
  var gathers

  switch (action.type) {
    case SET_GATHER:
      newState = { ...state, gather: action.gather }
      break
    case SET_GATHERS:
      newState = { ...state, gathers: action.gathers }
      break
    case REMOVE_GATHER:
      const lastRemovedGather = state.gathers.find(gather => gather._id === action.gatherId)
      gathers = state.gathers.filter(gather => gather._id !== action.gatherId)
      newState = { ...state, gathers, lastRemovedGather }
      break
    case ADD_GATHER:
      newState = { ...state, gathers: [...state.gathers, action.gather] }
      break
    case UPDATE_GATHER:
      gathers = state.gathers.map(gather => (gather._id === action.gather._id) ? action.gather : gather)
      newState = { ...state, gathers }
      break
    //itemList:
    case REMOVE_ITEM_FROM_GATHER:
      newState = { ...state, gather: action.gather }
      break
    case ADD_ITEM_TO_GATHER:
      newState = { ...state, gather: action.gather }
      break
    case UPDATE_ITEM_TO_GATHER:
      gathers = state.gathers.map(gather => (gather._id === action.gather._id) ? action.gather : gather)
      newState = { ...state, gathers, gather: action.gather }
      break
    case UNDO_REMOVE_GATHER:
      if (state.lastRemovedGather) {
        newState = { ...state, gathers: [...state.gathers, state.lastRemovedGather], lastRemovedGather: null }
      }
      break
    //userGuestList:

    case ADD_USER_TO_APPROVED_GUEST:
      newState = { ...state, gather: action.gather }
      break
    case REMOVE_USER_FROM_APPROVED_GUEST:
      newState = { ...state, gather: action.gather }
      break
    //chat history
    case ADD_MSG_TO_CHATHISTORY:
      newState = { ...state, gather: action.gather }
      break
    default:
  }
  return newState
}
