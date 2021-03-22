import { combineReducers } from 'redux'
import loggingReducers from './loggingReducers'
import sessionReducers from './sessionReducers'

const allReducers = combineReducers({
  clientName: loggingReducers,
  sessionCache: sessionReducers,
})

export default allReducers