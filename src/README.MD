Testing for Session class functionality was done locally with manual tests.
In this example, to test logging payments and clearing transactions for any 
owed amountsacounts A, B, C, D, E are created and some payments are made.
Note that 2 payments of 1 "circle back" to A

const s1 = new Session()
s1.loginClient("a")
s1.loginClient("b")
s1.loginClient("c")
s1.loginClient("d")
s1.loginClient("e")

s1.logPay("a","b",6)
s1.logPay("a","c",5)
s1.logPay("a","d",5)
s1.logPay("a","e",5)
s1.logPay("b","c",1)
s1.logPay("c","d",1)
s1.logPay("d","e",1)
s1.logPay("e","a",1)
s1.topUp("a", 25)
s1.transactAllPayments()
s1.print()
// >>>
// [ 5, 0, 0, 0, 0 ]
// [ 0, 5, 0, 0, 0 ]
// [ 0, 0, 5, 0, 0 ]
// [ 0, 0, 0, 5, 0 ]
// [ 0, 0, 0, 0, 5 ]


// the following return false and log "Invalid transaction" to the console
console.log(s1.logPay("a","a",10))
console.log(s1.logPay("a","b",-10))
console.log(s1.logPay("a","b",0.001))