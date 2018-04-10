const messages = ( state = [], action ) => {
  switch (action.type) {
    case 'GET_MESSAGES':
      return action.messages
    case 'ADD_MESSAGE':
      return [...state, action.message]
    default:
      return state
  }
}

export default messages;