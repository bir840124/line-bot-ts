// npx ts-node-dev --respawn app.ts
// Token----------------------------------------------
// 建喵
const channelAccessToken = 'RcNVpDxw1KT5fXiqOxO8IV0UDVMxyASjyRoytm5YIQs+n3rpKPDNc4EaB73hOPrkhUP4/WKZhEWVm2+xaIrHcYKe6ZI5sDaQj2C1koCXra7gB1CncwnVHJ8raeQ0ocP0LPkzons6q5ZDNix9w6xYiQdB04t89/1O/w1cDnyilFU=';
const channelSecret = 'f41862ba4f038bff84debe318aa9ab54';

// 愛豬涵
const ZhuHanchannelAccessToken = 'pygbbeW5kIf60d0MuZC7D7OrfNmS4eMhQZgQR+3YQ1XJ9N35fR59+y5KCLjZQT+W9rv34mI2yIQluWQwtL0R4c9ANb0hrNrO41ON6A/O8EPo4fsqYNUaihmV+9gbWwCte4a7wqNm4HvLpWo1TUMYjQdB04t89/1O/w1cDnyilFU=';
const ZhuHanchannelSecret = '0c1639dc09eea256b78c79c6b86dd65e';


// Group----------------------------------------------
// toYoutube
const toYoutube = "C49598b4a99067a3989b7b0fb04eead6a";
// 歐森朋友們遊戲房
const toOusen = "C44fffd3a5d768c90caf8e6b3ca3c880d";
// Test
const toTest = "Cd7b765b3028cf191d8848fb4e615e855";
// 用8+9蹲姿表現低姿態 邊說著:好想做愛喔!
const toUniversity = "C4ee58af0131b00a254137213fb746a21";
// 智慧管家
const toSmartHousekeeper = "Ccf40ca53c6c035d575510d8be38ea168";
// User----------------------------------------------
// 建喵
const toJianMiau = "U6eab5cfb8cd73d12f0303e09ab1fc0ff";
// 筑涵
const toZhuHan = "Ud24bc3e60bea064e195d209a44785557";
// 愛豬涵->建喵
const toZhuHantoJianMiau = "U5ebf63dae55c8d9983467db928e5bbcf";
// 愛豬涵->豬涵
const toZhuHantoZhuHan = "U499df212964be1fe0277eb7deb15eb76";

import line = require('@line/bot-sdk');
import express = require('express');
import https = require('https');
import fs = require('fs');


//讀取憑證及金鑰
const prikey = fs.readFileSync('privkey.pem', 'utf8');
const cert = fs.readFileSync('cert.pem', 'utf8');
const cafile = fs.readFileSync('chain.pem', 'utf-8');

//建立憑證及金鑰
const credentials = {
    key: prikey,
    cert: cert,
    ca: cafile
};

const config: line.Config = {
    channelAccessToken: channelAccessToken,
    channelSecret: channelSecret,
};

// create LINE SDK client
const client = new line.Client(<line.ClientConfig>config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(<line.MiddlewareConfig>config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});


// event handler
function handleEvent(event: line.WebhookEvent) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }

    console.log(`Received message: ${event.message.text}`);

    // create a echoing text message
    const echo: line.TextMessage = { type: 'text', text: "Hello你剛才說的是:" + event.message.text };

    // use reply API
    return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
const server = https.createServer(credentials, app);
server.listen(port, function () {
    console.log(`listening on ${port}`);
    console.log('[BOT已準備就緒]');
});