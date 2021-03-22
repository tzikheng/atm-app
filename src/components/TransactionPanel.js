import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'
import { Card, Form, Grid, Label, List } from 'semantic-ui-react'
import Session from '../classes/Session'
import { cacheSession, loginAction } from '../util/redux/actions'

function App(){
  const clientName = useSelector(state => state.clientName)
  const reduxCache = useSelector(state => state.sessionCache)
  const [ inputName, setInputName ] = useState('')
  const [ transaction, setTransaction ] = useState('')
  const [ amount, setAmount ] = useState('')
  const [ recipient, setRecipient ] = useState('')
  const [ invalidAmount, setInvalidAmount ] = useState('')
  const [ invalidRecipient, setInvalidRecipient ] = useState(false)
  const [ receivables, setReceivables ] = useState([])
  const [ payables, setPayables ] = useState([])
  const [ logs, setLogs ] = useState([])
  const [ errorMsg, setErrorMsg ] = useState(null)
  const dispatch = useDispatch()
  useEffect(() => {login(clientName)},[])

  function clearForm(action){
    setAmount('')
    setRecipient('')
    setErrorMsg(null)
    setInvalidRecipient(false)
    setInvalidAmount(false)
    action ? setTransaction(action) : setTransaction('')
  }

/*-------------------- Session instance and functions to handle transactions --------------------*/
  const session = reduxCache
    ? new Session(reduxCache[0], reduxCache[1], reduxCache[2], reduxCache[3])
    : new Session()

  function login(client){
    clearForm()
    setReceivables([])
    setPayables([])
    setInputName('')
    dispatch(loginAction(client))
    session.loginClient(client)
    setAllLogs(client, login=true)
    cache(session)
  }

  function setAllLogs(client, login=false){
    if (login === true){
      setLogs([String(`Hello, ${client}!`)])
    } else {
      setLogs(session.getLogs(clientName))
    }
    if(session.clientCount > 1) {
      setPayables(session.getPayables(client))
      setReceivables(session.getReceivables(client))
    }
  }

  function cache(session){
    let toCache = session.export()
    dispatch(cacheSession(toCache))
  }

  function topUp(){
    if (parseFloat(amount).toFixed(2) < 0.01){
      setInvalidAmount(true)
    } else {
      session.clearLogs()
      session.topUp(clientName, parseFloat(amount))
      session.transactAllPayments()
      setAllLogs(clientName, login=false)
      cache(session)
      clearForm()
      setAmount('')
    }
  }

  function pay(){
    if (recipient === clientName){
      setInvalidRecipient(true)
      setErrorMsg('Invalid transaction')
    } else if (!session.isClient(recipient)) {
      setInvalidRecipient(true)
      setErrorMsg('Recipient not found')
    } else {
      session.clearLogs()
      session.logPay(clientName, recipient, parseFloat(amount))
      session.transactAllPayments()
      setAllLogs(clientName, login=false)
      cache(session)
      clearForm()
      setAmount('')
    }
  }

  let markUp = (
    <Grid.Row>
      {clientName === null || clientName === ''
        ?
/*------------------------------------------ Login form ------------------------------------------*/
          <Card style={{height: 180, width: 300}}>
            <Card.Content>
              <Card.Header 
                color="red" 
                style={{margin: 10, marginBottom: 20}}>
                {"Please log in to continue"}
              </Card.Header>
              <Form>
                <Form.Field>
                  <Form.Input 
                    placeholder={'Name'}
                    value = {inputName}
                    onChange={(event) => setInputName(event.target.value)}
                    style={{width: 140}}
                    />
                </Form.Field>
                <button
                  type='submit'
                  className={'ui button red inverted'}
                  disabled={inputName.trim() === ''}
                  onClick={()=>login(inputName)}>
                  {'Submit'}
                </button>
              </Form>
            </Card.Content>
          </Card>
        : 
/*---------------------------------- Main transaction interface ---------------------------------*/
          <Card fluid style={{width: 300}}>
            <Card.Content textAlign='center'>
              <Form>
                <Form.Dropdown fluid selection
                  label='Action'
                  placeholder='Top up'
                  value={transaction}
                  options={[
                    { key: 'Top up', text: 'Top up', value: 'topUp' },
                    { key: 'Pay', text: 'Pay', value: 'pay' },
                  ]}
                  onChange={(_, { value }) => {clearForm(value)}}
                  style={{marginLeft: 65, marginRight: 65, width: 140}}
                />
                <Form.Input fluid
                  label='Amount'
                  placeholder='0.00'
                  value={amount}
                  onChange={(_, { value }) => {setAmount(value)}}
                  error={invalidAmount || (amount.trim()!=='' && !(Number(amount)>=0.01))}
                  style={{marginLeft: 65, marginRight: 65, width: 140}}
                  />
                { transaction === 'pay' &&
                  <Form.Input
                    label='Recipient'
                    value={recipient}
                    onChange={(_, { value }) => {setRecipient(value)}}
                    error={invalidRecipient}
                    fluid style={{marginLeft: 65, marginRight: 65, width: 140}}
                    />
                }
                <Form.Button
                  disabled={
                    (transaction === '') ||
                    (amount.trim()==='' || !(Number(amount)>=0.01)) || 
                    (transaction==='pay' && recipient.trim()==='')}
                  onClick={()=> transaction === 'topUp' ? topUp() : pay()}
                  type='submit' size='small' color='red' 
                >
                  {'Go!'}
                </Form.Button>
                { errorMsg === null || errorMsg === ''
                  ? null
                  : <Label basic color='red' style={{marginTop:-20}}>
                      {errorMsg}
                    </Label>
                }
              </Form>
              <List items={[
                ...logs,
                ...receivables,
                String(`Your balance is ${parseFloat(session.getBalance(clientName).toFixed(2))}.`), 
                ...payables]}/>
            </Card.Content>
          </Card>
      }
    </Grid.Row>
  )

  return markUp
}

export default App