import { applyMiddleware, createStore } from 'redux'
import { load, save } from 'redux-localstorage-simple'
import allReducers from './redux'


const createStoreWithMiddleware = applyMiddleware(
  save()
)(createStore)

const myStore = createStoreWithMiddleware(
  allReducers,
  load(),
)

export default myStore