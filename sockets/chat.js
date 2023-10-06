//chat.js
const ChatMessage = require('../models/ChatMessage');

module.exports = (io, socket, onlineUsers, channels) => {

    socket.on('new user', (username) => {
      //Save the username as key to access the user's socket id
      onlineUsers[username] = socket.id;
      //Save the username to socket as well. This is important for later.
      socket["username"] = username;
      console.log(`✋ ${username} has joined the chat! ✋`);
      io.emit("new user", username);
    })
    
    socket.on('new message', async (data) => {
      let newMessage = new ChatMessage({
        sender: data.sender,
        message: data.message,
        channel: data.channel
      });
      await newMessage.save();
    
      io.to(data.channel).emit('new message', data);
    });
    

    socket.on('get online users', () => {
      //Send over the onlineUsers
      socket.emit('get online users', onlineUsers);
    })

    socket.on('disconnect', () => {
      //This deletes the user by using the username we saved to the socket
      delete onlineUsers[socket.username]
      io.emit('user has left', onlineUsers);
    });

    socket.on('load channels', () => {
      //Load the existing channels
      socket.emit('load channels', channels);
    })

    socket.on('new channel', (newChannel) => {
      //Save the new channel to our channels object. The array will hold the messages.
      channels[newChannel] = [];
      //Have the socket join the new channel room.
      socket.join(newChannel);
      //Inform all clients of the new channel.
      io.emit('new channel', newChannel);
      //Emit to the client that made the new channel, to change their channel to the one they made.
      socket.on('user changed channel', async (newChannel) => {
        socket.join(newChannel);
        
        let oldMessages = await ChatMessage.find({ channel: newChannel }).sort({ timestamp: -1 }).limit(50);
        
        socket.emit('user changed channel', {
          channel: newChannel,
          messages: oldMessages
        });
      });
    });

    //Have the socket join the room of the channel
    socket.on('user changed channel', (newChannel) => {
      socket.join(newChannel);
      socket.emit('user changed channel', {
        channel : newChannel,
        messages : channels[newChannel]
      });
    });

  }