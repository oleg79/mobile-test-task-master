const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {pingTimeout: 30000});

io.on('connection', socket => {
  console.log('conected...');
  socket.emit('sport-list', [
    {
      id: 1,
      name: 'Футбол'
    }, {
      id: 2,
      name: 'Рэгби'
    }, {
      id: 3,
      name: 'Гандбол'
    }, {
      id: 4,
      name: 'Хоккей'
    }, {
      id: 5,
      name: 'Автоспорт'
    }, {
      id: 6,
      name: 'Теннис'
    },
  ]);


  socket.on('get-sport', (data) => {

    const {id} = data;

    const result = [];

    for (let i = 0; i < 1e2 * id; i++) {
      result.push((Math.random() * 1e10).toString(32));
    }

    socket.emit('get-sport', {response: result, meta: data});

  })


});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
