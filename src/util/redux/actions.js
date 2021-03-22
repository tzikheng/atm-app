export const loginAction = (clientName) => {
  return {
    type: 'LOGIN',
    clientName
  }
}

export const logoutAction = () => {
  return {
    type: 'LOGOUT'
  }
}

export const cacheSession = (sessionCache) => {
  return {
    type: 'CACHE',
    sessionCache
  }
}
