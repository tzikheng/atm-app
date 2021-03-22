// export default class Client{
//   constructor(name, balance=0, payables=[], receivables=[]){
//     this.name = name
//     this.balance = balance
//     this.payables = payables // [[amount, client<String>]... ]
//     this.receivables = receivables
//     }
//   // Export to array format for redux storage
//   export(){
//     return [this.name, this.balance, this.payables, this.receivables]
//   }
  
//   // Getters
//   getName(){
//     return this.name
//   }
//   getBalance(){
//     return this.balance
//   }
//   getPayables(){
//     return this.payables
//   }
//   getReceivables(){
//     return this.receivables
//   }

//   // Increase balance, then iterate through this.payables and pay owed amounts 
//   topUp(amt){
//     this.balance += amt
//     for (let i = 0; i < this.payables.length; i++) {
//       if (this.balance >= this.payables[i][0]){
//         this.payables[i][1].receive(this.payables[i][0], this.name)
//         this.balance -= this.payables[i][0]
//         this.payables[i][0] = 0
//       } else {
//         this.payables[i][1].receive(this.balance, this.name)
//         this.payables[i][0] -= this.balance
//         this.balance = 0
//       }
//     }
//     this.cleanupPayables()
//   }

//   // Pay another Client, write outstanding amounts to this.payables
//   // Calls other.receive, other.toReceive
//   pay(amt, who){
//     if (this.balance === 0){
//       this.payables.push([amt-this.balance, who])
//       who.toReceive(amt-this.balance, this.name)
//     } else if (amt >= this.balance) {
//       this.payables.push([amt-this.balance, who])
//       who.receive(this.balance, this.name)
//       who.toReceive(amt-this.balance, this.name)
//       this.balance = 0
//     } else {
//       this.balance -= amt
//       who.receive(amt, this.name)
//     }
//   }

//   cleanupPayables(){
//     for (let i = this.payables.length -1; i >= 0; i--){
//       if (this.payables[i][0] === 0){
//         this.payables.splice(i,1)
//       }
//     }
//   }

//   // Append logged owed amounts to this.receivables
//   toReceive(amt, from){
//     this.receivables.push([amt, from])
//   }

//   // Receive amount from another Client, remove cleared amounts owed from this.receivables
//   // Calls this.topUp
//   receive(amt, from){
//     const total_amt = amt
//     if (this.receivables.length > 0){
//       for (let i = 0; i < this.receivables.length; i++) {
//         if (this.receivables[i][1] === from) {
//           if (this.receivables[i][0] <= amt) {
//             amt -= this.receivables[i][0]
//             this.receivables[i][0] = 0
//           } else {
//             this.receivables[i][0] -= amt
//             amt = 0
//           }
//         }
//       }
//       this.cleanupReceivables()
//     }
//     this.topUp(total_amt)
//   }

//   cleanupReceivables(){
//     for (let i = this.receivables.length -1; i >= 0; i--){
//       if (this.receivables[i][0] === 0){
//         this.receivables.splice(i,1)
//       }
//     }
//   }
// }