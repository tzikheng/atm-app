import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'
import myStore from './util/myStore'

ReactDOM.render(
  <Provider store={myStore}>
    <App />
    </Provider>,
  document.getElementById('root')
)