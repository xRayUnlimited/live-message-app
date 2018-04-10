const isTyping = ( state = [], action ) => {
  switch (action.typing) {
    case 'START_TYPING':
      return [...new Set([...state, action.id])]
    case 'STOP_TYPING':
      return state.filter( u => u !== action.id )
    default:
      return state;
  }
}

export default isTyping;