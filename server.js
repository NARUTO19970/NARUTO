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

// USERS
let users=[

{
username:"admin",
password:"12345"
},

{
username:"user",
password:"123"
}

];

// LOGIN PAGE
app.get("/",(req,res)=>{

res.render("login");

});

// LOGIN CHECK
app.post("/login",(req,res)=>{

const {username,password}=req.body;

const user=users.find(

u=>
u.username===username &&
u.password===password

);

if(user){

if(user.username==="admin"){

res.redirect("/admin");

}else{

res.render("user");

}

}else{

res.send(
"Wrong Username or Password"
);

}

});

// ADMIN PAGE
app.get("/admin",(req,res)=>{

res.render("admin");

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

// SEEN
socket.on("messageSeen",()=>{

socket.broadcast.emit(
"seen"
);

});

// DISCONNECT
socket.on("disconnect",()=>{

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

// START SERVER
server.listen(
3000,
()=>{

console.log(
"Server running..."
);

});