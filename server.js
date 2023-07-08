const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
var cors = require('cors');
const io = new Server(server, { cors: { origin: '*' } });
// const useSocket = require('socket.io')

// const server = require('http').Server(app)
// const io = useSocket(server)

app.use(cors());

app.get('/', (req, res) => {
  res.send('hello');
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
});

server.listen(9999, () => {
  console.log('Сервер запущен');
});
