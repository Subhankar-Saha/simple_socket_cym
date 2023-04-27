const io = require("socket.io-client");
const socket = io.connect(process.env.URL);

socket.on("message",(data)=>{
    console.log( "From Client " ,data)
})