const http = require('http');
const socketIo = require('socket.io');
const port = 8080;
const server = http.createServer();
server.listen(port);
const io = socketIo(server);

const sockets = {};
const players = {};

io.sockets.on('connection', function (socket) {
  const id = socket.handshake.query.id;
  if (!id) return socket.disconnect();
  players[id] = { state: {}, source: id };
  sockets[id] = socket;
  
  socket.on('disconnect', () => {
    delete sockets[id];
    delete players[id];
    io.emit('offline', id);
  });

  socket.on('update', message => {
    if (!players[id] || !message.state) return;
    players[id].state = message.state;
    io.emit('update', { source: id, state: message.state });
  });

  socket.on('hit', message => {
    if (!message || !message.target || !sockets[message.target]) return;
    sockets[message.target].emit('hit', { source: id, options: message.options });
  });

  io.emit('online', id);
  socket.emit('sync', players);

  return null;

});
