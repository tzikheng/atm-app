const loggingReducers = (state = '', action) => {
  switch(action.type){
    case 'LOGIN':
      state = action.clientName
      return state
    
    case 'LOGOUT':
      state = ''
      return state

    default:
      return state
  }
}

export default loggingReducers