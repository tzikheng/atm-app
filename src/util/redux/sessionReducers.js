const sessionReducers = (state=null, action) => {
  switch(action.type){
    case 'CACHE':
      state = action.sessionCache
      return state

  default:
    return state
  }
}

export default sessionReducers