const express = require('express');
const app = express();
const cors = require('cors');
const SHA256 = require('crypto-js/sha256');
const { json } = require('express');
const port = 3042;

// localhost can have cross origin errorscd 
// depending on the browser you use!
app.use(cors());
app.use(json());

  
const balances = {}
for(let i = 0 ; i < 3; i++) {
  const EC = require('elliptic').ec;
  const ec = new EC('secp256k1');
  const key = ec.genKeyPair();
  const pubPoint = key.getPublic();
  const x = pubPoint.getX();
  const y = pubPoint.getY()
  const pub = pubPoint.encode('hex');
  const privateKey = key.getPrivate(`hex`);
  const publicKey = [key.getPublic().encode('hex')];
   balances[publicKey]= 100;
   
   console.log({
    privateKey: key.getPrivate().toString(16),
    publicX: key.getPublic().x.toString(16),
    publicY: key.getPublic().y.toString(16),
    publicKey: key.getPublic().encode('hex').toString(16),
  
    
  
  });
  
  app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {pubicKey, signature, transaction} = req.body;
  console.log(signature);
  const key = ec.keyFromPublic(pubicKey, 'hex');
  const isVerified = key.verify(SHA256(JSON.stringify(transaction)).toString(), signature);
  if (isVerified) {
   balances[publicKey] -= transaction.amount;
  balances[transaction.recipient] = (balances[transaction.recipient] || 0) + +transaction.amount;
  res.send({ balance: balances[pubicKey] });
  }
  else {
    res.sendStatus(400)
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
}