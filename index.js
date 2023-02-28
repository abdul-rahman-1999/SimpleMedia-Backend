const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const cors = require('cors');
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const upload = multer({ dest: 'uploads/' })
const http = require("http");
const { Server } = require('socket.io')
const app = express();

const server = http.createServer(app);

const io = new Server(server, { 
  cors:{
    credentials : true,
    origin : true,
  }
 });

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

//middleware
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))


app.use("/api/auth", authRoute);
app.use("/api/posts", upload.single('image'), postRoute);


let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  const socketId = socket.id

  socket.on("newUser", (username) => {
    addNewUser(username, socketId);
    io.emit("getUsers", onlineUsers)
  });

  socket.on("sendNotification", ({ senderName, receiverName, img }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      img,
    });
  });

  // socket.on("sendText", ({ senderName, receiverName, text }) => {
  //   const receiver = getUser(receiverName);
  //   io.to(receiver.socketId).emit("getText", {
  //     senderName,
  //     text,
  //   });
  // });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

server.listen(8800, () => {
  console.log("Backend server is running!");
});

