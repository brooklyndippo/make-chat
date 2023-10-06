//app.js
require('dotenv').config();
const mongoose = require('mongoose');

// Check if required environment variables are defined
if (!process.env.DEV_DB_URI || !process.env.DB_URI) {
  console.error('Missing required environment variables. Please check DEV_DB_URI and DB_URI.');
  process.exit(1); // Exit the application with an error code
}

// Check the NODE_ENV environment variable to determine the environment
const isProduction = process.env.NODE_ENV === 'production';

// Define connection strings for different environments
const devDbUri = process.env.DEV_DB_URI;
const dbUri = process.env.DB_URI;

// Use the appropriate connection string based on the environment
const connectionString = isProduction ? dbUri : devDbUri;

// Connect to the MongoDB database
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event handlers for database connection
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB database');
});

const express = require('express');
const app = express();
const server = require('http').Server(app);

const exphbs  = require('express-handlebars');

//Socket.io
const io = require('socket.io')(server);
//We'll store our online users here
let onlineUsers = {};
//Save the channels in this object.
let channels = {"General" : []};

io.on("connection", (socket) => {
  // Make sure to send the users to our chat file
  require('./sockets/chat.js')(io, socket, onlineUsers, channels);
})

app.engine('handlebars', exphbs.engine({ extname: '.handlebars', defaultLayout: "index", 
layoutsDir: "views"}));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
  res.render('index.handlebars');
})

server.listen('3001', () => {
  console.log('Server listening on Port 3001');
})