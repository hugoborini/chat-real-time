const app = require('express')();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const user = {}
app.get("/", (req, res)=>{
    res.sendFile(`${__dirname}/public/index.html`)
})

io.on("connection", (socket)=>{
    socket.on("new-user", (name)=>{
        user[socket.id] = name
        socket.broadcast.emit("user-connected", name)
    })
    socket.on("chat message", (msg) =>{
        console.log("message : " + msg)
        socket.broadcast.emit("chat message", {msg: msg, name: user[socket.id]} )
    })
    socket.on("disconnect", () =>{
        socket.broadcast.emit('user-disconnected', user[socket.id])
        delete user[socket.id]
    })
})

server.listen(3000, ()=>{
    console.log('ecoute sur le port 3000');
})