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
  players[playerId] = { state: {}, id: playerId };
  
  socket.on('disconnect', () => {
    delete sockets[socket.playerId];
    delete players[socket.playerId];
    io.emit('offline', socket.playerId);
  });

  socket.on('update', state => {
    if (!players[socket.playerId]) return;
    players[socket.playerId].state = state;
    io.emit('update', { id: socket.playerId, state: state });
  });

  socket.on('hit', targetId => {
    if (!sockets[targetId]) return;
    sockets[targetId].emit('hit', socket.playerId);
  });

  io.emit('online', socket.playerId);
  socket.emit('sync', players);

  return null;

});




