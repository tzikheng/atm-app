import React from "react"
import { useSelector } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'
import { Container, Grid, Header } from 'semantic-ui-react'
import "./App.css"
import LogoutButton from "./components/LogoutButton"
import TransactionPanel from "./components/TransactionPanel"

function App(){
  const clientName = useSelector(state => state.clientName)
  let markUp = (
    <div className="App">
      <Container textAlign='center'>
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Row>
            <Header as='h2' color='red'>{clientName ? `Welcome, ${clientName}`: 'Banking'}</Header>
          </Grid.Row>
          <TransactionPanel/>
          { clientName && <LogoutButton/>}
        </Grid>
      </Container>
    </div>
  )

  return markUp
}

export default App