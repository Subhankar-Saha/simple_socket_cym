require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server, { cors: { origin: process.env.ORIGIN } });

const SOCKET_PORT = process.env.PORT || 8080;

let arr = [];

app.use(cors({ origin: process.env.ORIGIN }));

app.get('/ping', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'hello from cyms-backend-socket'
	})
})

server.listen(SOCKET_PORT, () => { console.log(`Socket Server is running at port ${SOCKET_PORT}`) })

// socket io module

io.on("connection", (socket) => {
	let roomId = "";
	if (socket.handshake.query.fsId) {
		roomId = socket.handshake.query.fsId;
	}

	if (socket.handshake.query.machineId) {
		roomId = socket.handshake.query.machineId;
	}
	socket.join(roomId)
	console.log("Socket Connected ", roomId , socket.id)
	socket.on("container", (data) => {
		socket.to(roomId).emit("container", data);
	})

	socket.on("containerError", (data) => {
		socket.to(roomId).emit("containerError", data);
	})

	socket.on("containerOutError", (data) => {
		socket.to(roomId).emit("containerOutError", data);
	})

	socket.on("containerOut", (data) => {
		socket.to(roomId).emit("containerOut", data);
	})

	socket.on("message", (data) => {
		socket.to(roomId).emit("message", data)
	})

	socket.on("task", (data) => {
		socket.to(roomId).emit("task", data);
	})


	socket.on('disconnect', async () => {
		console.log("some people are left ", roomId , socket.id);
	})

})


