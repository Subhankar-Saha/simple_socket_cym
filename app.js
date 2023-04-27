require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server,{cors:{origin: process.env.ORIGIN }});

const SOCKET_PORT = process.env.PORT || 8080;

let arr = []; 

app.use(cors({ origin: process.env.ORIGIN }));

app.get('/ping', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'hello from cyms-backend-socket'
	})
})

server.listen(SOCKET_PORT,()=>{ console.log(`Socket Server is running at port ${SOCKET_PORT}`)})

// socket io module

io.on("connection",(socket)=>{
	let socketId = socket.id ;
    console.log("Socket Connected ", socketId)
	arr.push(socketId)
	socket.on("message",(data)=>{
		console.log(data);
		arr.map((ele)=>{
			io.to(ele).emit("message", data)
		})
	})
	socket.on('disconnect',async()=>{
		const index = arr.indexOf(socketId);
		if (index > -1) { 
			arr.splice(index, 1);
		}
        console.log("some people are left..", socketId);
    })

})


