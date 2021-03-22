import React from "react"
import { useDispatch } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'
import { loginAction } from '../util/redux/actions'

function LogoutButton(){
  const dispatch = useDispatch();

  function logout(){
    dispatch(loginAction(''))
  }
  
  let markUp = (
    <button
      className={'ui button red inverted'}
      onClick={()=>logout()}>
      {'Logout'}
    </button>
  )
  return markUp
}

export default LogoutButton