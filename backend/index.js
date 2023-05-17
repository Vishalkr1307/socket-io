const express=require('express')
const app=express()
const server=require("http").createServer(app)
const io=require("socket.io")(server)
const port=3000
let users={}
const path=require("path")
// app.use(express.json())
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')));
// app.use('/socket.io', express.static(path.join(__dirname, 'index.html')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

io.on("connection",socket=>{
    socket.on("new-user-joined",name=>{
        console.log(name)
        users[socket.id]=name
        socket.broadcast.emit("user-joined",name)

    })
    socket.on("send",message=>{
        console.log(message)
        socket.broadcast.emit("received",{message:message,name:users[socket.id]})
    })
    socket.on("disconnect",name=>{
        socket.broadcast.emit("left",users[socket.id])
        delete users[socket.id]
    })

} )




app.listen(port,(req,res)=>{
    console.log(`server listening on ${port}`)
})
