const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
// const fullNode = new HttpProvider("http://192.168.1.162:8090"); local test
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
//our account: TJiNrUPqJGEU1bgxS2QEFDeHqHRwExtT3j
const privateKey = "78DDAE289DD4FA40DDBA74EA2E2D35632EFFC6FC97516D034FABDAFD12A4174D";
const tronWeb = new TronWeb(fullNode, privateKey);

// USDT contract "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; 
async function sendTrc20(trc20_toekn, to_address, amount, fee_limit) {
    let {
        transaction,
        result
    } = await tronWeb.transactionBuilder.triggerSmartContract(
        trc20_toekn, 'transfer(address,uint256)', {
            feeLimit: fee_limit,
            callValue: 0
        },
        [{
            type: 'address',
            value: to_address
        }, {
            type: 'uint256',
            value: amount
        }]
    );
    if (!result.result) {
        console.error("error:", result);
        return;
    }
    console.log("transaction =>", JSON.stringify(transaction, null, 2));

    const signature = await tronWeb.trx.sign(transaction.raw_data_hex);
    console.log("Signature:", signature);
    transaction["signature"] = [signature];

    const broadcast = await tronWeb.trx.sendRawTransaction(transaction);
    console.log("result:", broadcast);

    const {
        message
    } = broadcast;
    if (message) {
        console.log("Error:", Buffer.from(message, 'hex').toString());
    }
}
