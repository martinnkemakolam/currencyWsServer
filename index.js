let https = require('http')
let ws = require('ws')
let server = https.createServer()
let cyptoSocketConnection = new ws('wss://marketdata.tradermade.com/feedadv')
let wsForClient = new ws.WebSocketServer({port: 8000})
let dataToSend = [{
    symbol: 'BTCUSD',
    price: '',
},{
    symbol: 'XAUUSD',
    price: ''
},{
    symbol: 'EURUSD',
    price: '',
},{
    symbol: 'GBPUSD',
    price: '',
},{
    symbol: 'ETHUSD',
    price: '',
},{
    symbol: 'SHIBUSD',
    price: '',
}]

cyptoSocketConnection.on('open', ()=>{
    let detail = {
        userKey: "ws1mZP8S1LuCvab1_GIA",
        symbol: "BTCUSD,XAUUSD,EURUSD,GBPUSD,ETHUSD,SHIBUSD"
    }
    cyptoSocketConnection.send(JSON.stringify(detail));
})

cyptoSocketConnection.on('message', incoming=(data)=>{
    if (data != 'Connected') {
        data = JSON.parse(data);
        console.log(data);
        dataToSend.forEach((ele, id)=>{
            if(ele.symbol === data.symbol){
                ele.price = data.ask
            }
        })
    }
})
cyptoSocketConnection.on('close', ()=>{
    clientWs.close()
    console.log('Connection closed');
})

wsForClient.on('connection', (clientWs)=>{
    console.log('connection established')
    // let cont = true
    let interval = setInterval(()=>{
        clientWs.send(JSON.stringify(dataToSend))
    }, 1500)
    clientWs.on("close", ()=>{
        clearInterval(interval)
    })
})
server.listen(9000, ()=>{
    console.log('listening on port 9000')
})