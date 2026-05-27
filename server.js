const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e8
});

let onlineUsers = 0;

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.use(express.urlencoded({
  extended: true
}));

// LOGIN PAGE
app.get("/", (req, res) => {
  res.render("login");
});

// LOGIN
app.post("/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  // ADMIN
  if (
    username === "admin" &&
    password === "12345"
  ) {
    res.render("admin");
  }

  // USER
  else if (
    username === "user" &&
    password === "123"
  ) {
    res.render("user");
  }

  // WRONG
  else {
    res.send("Wrong Username or Password");
  }

});

// SOCKET
io.on("connection", (socket) => {

  onlineUsers++;

  io.emit("onlineUsers", onlineUsers);

  // MESSAGE
  socket.on("newMessage", (data) => {

    io.emit("newMessage", {
      message: data.message,
      sender: data.sender,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      seen: "✔✔ Seen"
    });

  });

  // FILE
  socket.on("fileUpload", (data) => {

    io.emit("fileUpload", data);

  });

  // VOICE
  socket.on("voiceMessage", (data) => {

    io.emit("voiceMessage", data);

  });

  // TYPING
  socket.on("typing", (msg) => {

    socket.broadcast.emit("typing", msg);

  });

  // DISCONNECT
  socket.on("disconnect", () => {

    onlineUsers--;

    io.emit("onlineUsers", onlineUsers);

  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});