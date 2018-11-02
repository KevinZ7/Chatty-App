// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');
const ws = require('ws');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

wss.broadcast = function braodcast(data) {
  wss.clients.forEach((client) => {
    if(client.readyState === ws.OPEN){
      client.send(JSON.stringify(data));
    }
  })
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  var colorSelection = ['Maroon','Orange','Green','Purple','Blue','Gray'];
  var randomColor = colorSelection[getRandomInt(0,5)];

  console.log('Client connected');

  var onlineUsers = {
    type: "onlineUsers",
    count: wss.clients.size
  }

  var color = {
    type: "userColor",
    color: randomColor
  }

  wss.broadcast(onlineUsers);

  ws.send(JSON.stringify(color));



  ws.on('message', (data) => {
    var newMessage = JSON.parse(data);
    switch(newMessage.type){
      case "postMessage":
        newMessage.id = uuidv4();
        newMessage.type = 'incomingMessage';
        break;
      case "postNotification":
        newMessage.id = uuidv4;
        newMessage.type = 'incomingNotification';
        break;
      default:
        throw new Error("Unknown event type" + data.type);
    }

    wss.broadcast(newMessage);
  })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    var onlineUsers = {
      type: "onlineUsers",
      count: wss.clients.size
    }

    wss.broadcast(onlineUsers);

  });
});

