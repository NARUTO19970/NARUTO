const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let onlineUsers = 0;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

// LOGIN PAGE
app.get("/",(req,res)=>{

res.render("login");

});

// LOGIN CHECK
app.post("/login",(req,res)=>{

const { username,password }=req.body;

// ADMIN LOGIN
if(
username==="admin" &&
password==="12345"
){

return res.render("admin");

}

// USER LOGIN
if(
username==="user" &&
password==="123"
){

return res.render("user");

}

res.send(
"Wrong Username or Password"
);

});

// ADMIN PAGE
app.get("/admin",(req,res)=>{

res.render("admin");

});

// USER PAGE
app.get("/user",(req,res)=>{

res.render("user");

});

// SOCKET
io.on("connection",(socket)=>{

console.log(
"User Connected"
);

onlineUsers++;

io.emit(
"onlineUsers",
onlineUsers
);

// TEXT
socket.on(
"newMessage",
(data)=>{

io.emit(
"newMessage",
data
);

});

// IMAGE
socket.on(
"newImage",
(data)=>{

io.emit(
"newImage",
data
);

});

// VOICE
socket.on(
"newVoice",
(data)=>{

io.emit(
"newVoice",
data
);

});

// TYPING
socket.on(
"typing",
()=>{

socket.broadcast.emit(
"typing",
"Typing..."
);

});

// SEEN
socket.on(
"messageSeen",
()=>{

socket.broadcast.emit(
"seen"
);

});

// DISCONNECT
socket.on(
"disconnect",
()=>{

onlineUsers--;

io.emit(
"onlineUsers",
onlineUsers
);

console.log(
"User Disconnected"
);

});

});

server.listen(
3000,
()=>{

console.log(
"Server running on http://localhost:3000"
);

});