const { Server } = require("socket.io");
const socketIoServer = (server) => {
const io = new Server(server,  {
  cors: {
    origin: '*',
  }
});
let connectedUsers = [];

io.on('connection', (socket) => {
  socket.on('disconnect', () =>
     console.log(`Disconnected: ${socket.id}`));
  socket.on('join', (room) => {
     socket.join(room.userId);
  });
  socket.on('foundCard', (data) => {
    const {userId, card} = data;
    if (data) {
    socket.to(userId).emit('getFoundCard', `Han encontrado tu carta: ${card.name}`)
    }
    
  });
});
};

module.exports = socketIoServer