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

const rooms = new Map();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.send(obj);
});
app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ]),
    );
  }
  // console.log(rooms.values);
  res.json([...rooms.keys()]);
});
io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];

    socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users);
    // socket.broadcast.to(roomId).emit('ROOM:JOINED', users);
  });
  socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
    const obj = { userName, text };
    rooms.get(roomId).get('messages').push(obj);
    socket.broadcast.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
  });
  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];

        socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users);
      }
    });
  });
  console.log('socket connected', socket.id);
});

server.listen(9999, () => {
  console.log('Сервер запущен');
});
