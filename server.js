const http = require('http');
const socketIo = require('socket.io');
const port = 8080;
const server = http.createServer();
server.listen(port);
const io = socketIo(server);

const sockets = {};
const players = {};

io.sockets.on('connection', function (socket) {
  const playerId = socket.handshake.query.playerId;
  if (!playerId) return socket.disconnect();
  socket.playerId = playerId;

  players[playerId] = { 
    state: {},
    source: playerId 
  };

  sockets[playerId] = socket;
  
  socket.on('disconnect', () => {
    delete sockets[socket.playerId];
    delete players[socket.playerId];
    io.emit('offline', playerId);
  });

  socket.on('update', state => {
    if (!players[playerId]) return;
    players[playerId].state = state;
    io.emit('update', { 
      source: playerId, 
      state: state 
    });
  });

  socket.on('hit', message => {
    if (!message || !message.target || !sockets[message.target]) return;
    sockets[message.target].emit('hit', { 
      source: playerId,
      options: message.options
    });
  });

  io.emit('online', playerId);
  socket.emit('sync', players);

  return null;

});
