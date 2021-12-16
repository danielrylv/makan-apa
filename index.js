const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const socketByUser = {};
const userBySocket = {};

io.on('connection', (socket) => {
  const { userId } = socket.handshake.auth;
  
  console.log(userId, 'connected');

  if (!socketByUser[userId]) {
    socketByUser[userId] = [];
  }

  socketByUser[userId].push(socket.id);
  userBySocket[socket.id] = userId;

  socket.on('chat message', ({ content, to }) => {
    if (socketByUser[to]) {
      socketByUser[to].forEach(id => {
        socket.to(id).emit('chat message', {
          content,
          from: userBySocket[socket.id]
        })
      });
    }
  });

  socket.on('disconnect', () => {
    const username = userBySocket[socket.id]; 
    const idx = socketByUser[username].indexOf(socket.id);

    socketByUser[username].splice(idx, 1);

    if (socketByUser[username].length == 0) {
      delete socketByUser[username];
    }

    delete userBySocket[socket.id];
  });
});

const PORT = 3000;

server.listen(3000, () => {
  console.log(`server is running on port ${PORT}`);
});
