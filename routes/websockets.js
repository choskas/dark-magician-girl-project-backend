const {Router} = require('express');
const router = Router();
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8082 });
wss.on('connection', (ws) => {
  console.log('New client connected!');

  ws.on('message', async (data) => {
    console.log(data);
  });
  ws.on('close', () => {
    console.log('Client disconnected ');
  });
});

router.post('/websocket-example', async (req, res, next) => {
    await wss.clients.forEach(async (client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log('passsssssssssssss')
       // Lo que debe hacer el websocket aqui
      }
    });
    return res.send('websocket');
  });

module.exports = router;