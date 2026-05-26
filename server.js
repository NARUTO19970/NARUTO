const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

let onlineUsers = 0;

app.set("view engine","ejs");

app.set(
"views",
path.join(__dirname,"views")
);

app.use(express.static("public"));

app.use(express.urlencoded({
extended:true
}));

// LOGIN PAGE
app.get("/",(req,res)=>{

res.render("login");

});

// LOGIN CHECK
app.post("/login",(req,res)=>{

const username =
req.body.username;

const password =
req.body.password;

// ADMIN LOGIN
if(
username === "admin" &&
password === "12345"
){

res.render("admin");

}

// USER LOGIN
else if(
username === "user" &&
password === "123"
){

res.render("user");

}

// WRONG LOGIN
else{

res.send(
"Wrong Username or Password"
);

}

});

// SOCKET CONNECTION
io.on("connection",(socket)=>{

onlineUsers++;

io.emit(
"onlineUsers",
onlineUsers
);

// MESSAGE
socket.on("newMessage",(data)=>{

io.emit(
"newMessage",
data
);

});

// IMAGE
socket.on("newImage",(data)=>{

io.emit(
"newImage",
data
);

});

// VOICE
socket.on("newVoice",(data)=>{

io.emit(
"newVoice",
data
);

});

// TYPING
socket.on("typing",()=>{

socket.broadcast.emit(
"typing",
"Typing..."
);

});

// DISCONNECT
socket.on("disconnect",()=>{

onlineUsers--;

io.emit(
"onlineUsers",
onlineUsers
);

});

});

const PORT =
process.env.PORT || 3000;

server.listen(PORT,()=>{

console.log(
`Server running on port ${PORT}`
);

});