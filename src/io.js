const jsonwebtoken = require('jsonwebtoken');
const _ = require('lodash');
const profile = require('./controllers/profile');

let connectedUsers = {};

module.exports = io => {
  io.on('connection', async socket => {
    const { token } = socket.handshake.query;

    // get the data from jwt
    const { id } = await jsonwebtoken.verify(token, process.env.SECRET);

    socket.join(id); // use the user id as room
    const user = await profile.info(id);

    io.to(id).emit('connected', { id: socket.id, connectedUsers }); // emit when the user is connected
    socket.broadcast.emit('joined', {
      id,
      user
    });
    connectedUsers[id] = user;
    socket.on('send', data => {
      socket.broadcast.emit('new-message', {
        from: { id, username: user.username },
        data
      });
    });

    socket.on('disconnect', () => {
      connectedUsers = _.omit(connectedUsers, id);
      io.emit('disconnected', id);
    });
  });
};
