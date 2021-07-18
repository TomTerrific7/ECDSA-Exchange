import "./index.scss";
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

const server = "http://localhost:3042";

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;
  //insert private key
  const privateKey = document.getElementById("privateKey").value;

  const transaction = {
    amount, recipient, privateKey, publicKey
  }

  //allows user to supply private key to front-end
  const key = ec.keyFromPrivate(privateKey, 'hex');

  //users private key needs to sign the transaction
  const signature = key.sign(SHA256(JSON.stringify(transaction)).toString());

  const body = JSON.stringify({
    transaction, signature: signature.toDER('hex'), publicKey: key.getPublic().encode('hex')
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});
