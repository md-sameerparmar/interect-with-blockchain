const fetch = require('node-fetch');
const aptos = require('aptos');
var express = require("express");
var bodyParser = require('body-parser');

var app = express();

var urlencodeParser = bodyParser.urlencoded({ extended: false})

const client = new aptos.AptosClient("https://fullnode.devnet.aptoslabs.com");

const a1 = {
    address: "0x849668cc2d60de84ab52a35fdf4951eae9aea0457de965687fc68e74855f6765",
    publicKeyHex: "0x38cdaf7d35b44a853a5e3d028affbce6cb7f6eb8fffb13390ecd0c2f1632c8fc",
    privateKeyHex: "0xb9412424598f13339b62d7816b7d82f77492befebe7183bfc9888d31bdb365f238cdaf7d35b44a853a5e3d028affbce6cb7f6eb8fffb13390ecd0c2f1632c8fc"
};

app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
 })

app.get('/get_message', async (req, res) =>{
    await fetch("https://fullnode.devnet.aptoslabs.com/v1/accounts/0x849668cc2d60de84ab52a35fdf4951eae9aea0457de965687fc68e74855f6765/resource/0x849668cc2d60de84ab52a35fdf4951eae9aea0457de965687fc68e74855f6765::message::MessageHolder")
        .then((resp) => resp.json())
        .then((resk) => res.send(resk.data.message))
        .catch((err) => res.send(err))
})

    app.get('/set_message', async (req, res) =>{
        const account1 = aptos.AptosAccount.fromAptosAccountObject(a1);
        const payload = {
            type: "entry_function_payload",
            function: "0x849668cc2d60de84ab52a35fdf4951eae9aea0457de965687fc68e74855f6765::message::set_message",
            type_arguments: [],
            arguments: [req.query.message],
          };
        const txnRequest = await client.generateTransaction(account1.address(), payload);
        const signedTxn = await client.signTransaction(account1, txnRequest);
        //console.log(signedTxn);
        const transactionRes = await client.submitTransaction(signedTxn);
        await client.waitForTransaction(transactionRes.hash);
        res.send("Submitted!");
    })

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://localhost:%s", port)
})