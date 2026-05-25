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

app.get("/", (req, res) => {

    res.render("user");

});

app.get("/admin", (req, res) => {

    const password = req.query.password;

    if(password === "12345"){

        res.render("admin");

    }else{

        res.send("Wrong Password");

    }

});

io.on("connection", (socket)=>{

    console.log("User Connected");

    onlineUsers++;

    io.emit("onlineUsers", onlineUsers);

    socket.on("newMessage", (data)=>{

        io.emit("newMessage", data);

    });

    socket.on("newImage", (data)=>{

        io.emit("newImage", data);

    });

    socket.on("newVoice", (data)=>{

        io.emit("newVoice", data);

    });

    socket.on("typing", ()=>{

        socket.broadcast.emit(
            "typing",
            "Typing..."
        );

    });

    socket.on("messageSeen", ()=>{

        socket.broadcast.emit("seen");

    });

    socket.on("disconnect", ()=>{

        onlineUsers--;

        io.emit(
            "onlineUsers",
            onlineUsers
        );

    });

});

server.listen(3000, ()=>{

    console.log(
        "Server running on http://localhost:3000"
    );

});