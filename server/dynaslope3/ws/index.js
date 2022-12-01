const express = require("express");
const app = express();
// const http = require("http");
const https = require("https");
const fs = require("fs");

let options = {
    key: fs.readFileSync('/home/softwareinfra/certificates/dynaslope.key'),
    cert: fs.readFileSync('/home/softwareinfra/certificates/dynaslope.crt'),
    ca: fs.readFileSync('/home/softwareinfra/certificates/dynaslope.crt'),
    requestCert: false,
    rejectUnauthorized: false
}

const server = https.createServer(options, app);

const { Server } = require("socket.io");

const io = new Server(server);

const axios = require("axios");
const dotenv = require('dotenv');

let client_list = [];

dotenv.config({ path: './.env' });

app.get("/", (req, res = null) => {
    res.send("Hello World!");
});

const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });


io.on('connection', (socket) => {
    let user_id;
    if (socket.handshake.headers.user_id) {
        user_id = socket.handshake.headers.user_id;
    } else {
        user_id = socket.handshake.auth.user_id;
    }
    new_client = client_list.findIndex((client) => client.id == user_id);
    if (new_client == -1) {
        client_list.push({
            id: user_id,
            ws_id: socket.id
        })
    } else {
        client_list[new_client] = {
            id: user_id,
            ws_id: socket.id
        }
    }

    socket.on('disconnect', (callback) => {
        let updated_clients = [];
        io.fetchSockets().then((response) => {
            response.forEach(element => {
                let client = client_list.find(x => x.ws_id = element.id)
                if (client != undefined) {
                    updated_clients.push(client)
                }
            });
            client_list = updated_clients;
        })
    });

    socket.on("message", ({ code, key, req }) => {
        if (key == process.env.WSS_KEY) {
            switch (code) {
                case "initialize_inbox":
                    break;
                case "send_msg":
                    instance.post(`${process.env.API_URL}/message/send`, req).then((response) => {
                        if (response.data.status == true) {
                            recipient = client_list.findIndex((client) => client.id == req.recipient_user_id);
                            if (recipient != -1) {
                                console.log(client_list[recipient].id)
                                console.log("EMIT TO:", client_list[recipient].ws_id, "WITH ID:", client_list[recipient].id)
                                console.log("new msg", response.data.res)
                                socket.broadcast.to(client_list[recipient].ws_id).emit('message', JSON.stringify({
                                    code: "chat_recieved",
                                    res: response.data.res
                                }));
                                instance.post(`${process.env.API_URL}/api/notifications/send_notification`, {
                                    code: 'chat',
                                    recipient_id: req.recipient_user_id,
                                    sender_id: req.sender_user_id,
                                    msg: req.msg,
                                    is_logged_in: true,
                                    room_id: req.room_id
                                })
                            } else {
                                instance.post(`${process.env.API_URL}/api/notifications/send_notification`, {
                                    code: 'chat',
                                    recipient_id: req.recipient_user_id,
                                    sender_id: req.sender_user_id,
                                    msg: req.msg,
                                    is_logged_in: false
                                })
                            }
                        }
                    }).catch((error) => {
                        console.log(error.message)
                        console.log("HERE")
                    })
                    break;
            }
        }
    })
});


server.listen(6060, () => {
    console.log('listening on *:6060');
    setInterval(() => {
        console.log("----------CLIENT LIST----x---")
        console.log(client_list)
        console.log("-------------------------------")
    }, 3000);
});