const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

let onlineUsers = 0;

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.use(express.urlencoded({ extended:true }));

// LOGIN USERS
let users = [
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
app.get("/", (req,res)=>{

res.render("login");

});

// LOGIN CHECK
app.post("/login",(req,res)=>{

const { username,password } = req.body;

const user = users.find(
u =>
u.username === username &&
u.password === password
);

if(user){

if(username === "admin"){

res.redirect("/admin?password=12345");

}else{

res.render("user");

}

}else{

res.send("Wrong Username or Password");

}

});

// ADMIN PAGE
app.get("/admin", (req, res) => {

const password = req.query.password;

if(password === "12345"){

res.render("admin");

}else{

res.send("Wrong Password");

}

});

// SOCKET
io.on("connection", (socket)=>{

console.log("User Connected");

onlineUsers++;

io.emit(
"onlineUsers",
onlineUsers
);

// TEXT MESSAGE
socket.on("newMessage", (data)=>{

io.emit(
"newMessage",
data
);

});

// IMAGE MESSAGE
socket.on("newImage", (data)=>{

io.emit(
"newImage",
data
);

});

// VOICE MESSAGE
socket.on("newVoice", (data)=>{

io.emit(
"newVoice",
data
);

});

// TYPING
socket.on("typing", ()=>{

socket.broadcast.emit(
"typing",
"Typing..."
);

});

// SEEN
socket.on("messageSeen", ()=>{

socket.broadcast.emit(
"seen"
);

});

// DISCONNECT
socket.on("disconnect", ()=>{

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

// SERVER START
server.listen(3000, ()=>{

console.log(
"Server running on http://localhost:3000"
);

});