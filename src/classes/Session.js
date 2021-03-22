export default class Session {
  /*
  This aims to create a record of balances and transactions for all clients, which can be 
  viewed as a 2d array stored as class attribute this.record. The vertical axis can be 
  referenced to see from which client a payment is transacting, and the horizontal axis 
  to which client. Clients are indexed in the clientIndex dictionary.
  
  For example, client 0 will have his balance reflected in record[0][0], and the sum of 
  outstanding payments to client 1 is reflected in record[0][1]
  */
  constructor(
    clientCount=0, clientNames=[], clientIndex={}, record=[0], transferLog={}){
    this.clientCount = clientCount
    this.clientNames = clientNames
    this.clientIndex = clientIndex
    this.record = record
    this.transferLog = transferLog
  }

  createNewClient(client){
    const _clientCount = this.clientCount
    const _clientNames = this.clientNames
    const _clientIndex = this.clientIndex
    const _record = this.record
    const _transferLog = this.transferLog
    try{
      this.clientNames.push(client)
      this.clientIndex[client] = this.clientCount
      this.transferLog[client] = []
      this.clientCount += 1
      if (this.clientCount === 1){
        this.record = [[0],]
      } else {
        var tempArray = this.record
        for( let i=this.clientCount-1; i<this.clientCount; i++ ) {
          tempArray.push([]);
        }
        for (let i = 0; i < this.clientCount; i++) {
          for (let j =  tempArray[i].length; j < this.clientCount; j++) {
            tempArray[i].push(0)
          }
        }
      }
      console.log('New account created for ' + client)
    } catch(err) {
      this.clientCount = _clientCount
      this.clientNames = _clientNames
      this.clientIndex = _clientIndex
      this.record = _record
      this.transferLog = _transferLog
      console.log('Failed to create new account')
    }
  }

  isClient(client){
    return this.clientNames.includes(client)
  }

  loginClient(client){
    if (!this.isClient(client)){
      this.createNewClient(client)
    }
  }

  export(){
    return [
      this.clientCount, 
      this.clientNames, 
      this.clientIndex, 
      this.record, 
      this.transferLog]
  }
  
  getBalance(client){
    let i = this.clientIndex[client]
    return this.record[i][i]
  }

  clearLogs(){
    this.clientNames.forEach(client =>
      this.transferLog[client] = []
    )
  }

  getLogs(client){
    return this.transferLog[client]
  }

  topUp(client, amount){
    // Secondary input check
    if (Number(parseFloat(amount).toFixed(2) < 0.01)) {
      console.log('Invalid transaction')
      return false
    } else {
      let i = this.clientIndex[client]
      this.record[i][i] += Number(parseFloat(amount).toFixed(2))
    }
  }

  logPay(clientFrom, recipient, amount){ // works
    let f = this.clientIndex[clientFrom]
    let t = this.clientIndex[recipient]
    if ( f === t || Number(parseFloat(amount).toFixed(2) < 0.01)) { 
      console.log('Invalid transaction')
      return false
    } else if (this.record[t][f] === 0) {
      this.record[f][t] += amount
    } else if (this.record[t][f] < amount){
      this.record[f][t] = amount - this.record[t][f]
      this.record[t][f] = 0
    } else {
      this.record[t][f] -= amount
    }
  }

  getPayables(clientFrom){
    let rv = []
    if (this.clientCount > 1){
      let f = this.clientIndex[clientFrom]
      for (let t = 0; t < this.clientCount; t++){
        if (f!==t && this.record[f][t] > 0){
          let recipient = this.clientNames[t]
          rv.push(String(`Owing ${this.record[f][t]} to ${recipient}.`))
        }
      }
    }
    return rv
  }

  getReceivables(client){
    let rv = []
    if (this.clientCount > 1){
      let j = this.clientIndex[client]
      for (let i = 0; i < this.clientCount; i++){
        if (i !== j && this.record[i][j] > 0){
          let payer = this.clientNames[i]
          rv.push(String(`Owing ${this.record[i][j]} from ${payer}.`))
        }
      }  
    }
    return rv
  }

  clientPaysDebts(f){ // works
    let clientFrom = this.clientNames[f]
    while (this.record[f][f] > 0 && this.sumClientPayables(f) > 0){
      for (let t = 0; t < this.clientCount; t++){
        if(f !== t && this.record[f][t] > 0){
          let minPay = Math.min(this.record[f][t], this.record[f][f])
          this.record[f][f] -= minPay
          this.record[f][t] -= minPay
          this.record[t][t] += minPay
          let recipient = this.clientNames[t]
          this.transferLog[clientFrom].push(String(`Transferred ${minPay} to ${recipient}.`))
        }
      }
    }
  }

  sumClientPayables(f){ // works
    let sum = 0
    for (let t = 0; t < this.clientCount; t++){
      if (f!==t){
        sum += this.record[f][t]
      }
    }
    return sum
  }

  transactablePayments(){
    for (let i = 0; i < this.clientCount; i++){
      if (this.record[i][i] > 0 && this.sumClientPayables(i) > 0) {
        return true
      }
    }
    return false
  }

  transactAllPayments(){
    let flag = true
    while (flag === true){
        for (let f = 0; f < this.clientCount; f++){ // for each client
          if (this.record[f][f] > 0 && this.sumClientPayables(f) > 0){ // if client has debt and a positive balance
            this.clientPaysDebts(f)
            console.log(this.clientNames[f])
            }
          }
          flag = this.transactablePayments()
        }
      }
  
  print(){
    for (let i = 0; i < this.clientCount; i++){
      console.log(this.record[i])
    }
  }
}