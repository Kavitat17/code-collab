const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');

const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: '*',
    },
});

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const userSocketMap = {};  //object for like konsi socket id konse user ki hai
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
    // io.sockets.adapter ye code jitne bhi rooms hai aapke adapter or socket server ke andar unhe get karega
    //and eska type hota hai map so if nahi hai return empty array
    //us map ko array me we are converting using from method 
    //then use aaray ko ham map kar rahe hai using callback function like we are returning a object having socketid and username of that client
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    //flow
    //jaise hi client koi join karta hai to ye jo event hai wo trigger karta hai frontend se 
    //eske upar ham yahape listen kar rahe hai uske andar hame milta hai roomid and username jo client join karna chahta hai

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId); //es socket ko es room ke andar join karega
        //if already users are present we should notify them that someone new has joined
        const clients = getAllConnectedClients(roomId);
        //for each since sabko notif bhejna hai
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    //broadcasting things like code change chat etc
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        // console.log("receiving code",code);
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code }); //it means broadcasting i.e mujhe chodke sabko ye bhejo
        //if we use same but insted of socket.in we use io.to then cursor ulta jata hai
        //like wo jaise hi type karge wo server pe jayega nd server se use sam etext milega uski vajah se jo bhi uske code code editor me hai wo 
        //override ho jayega and cursor jo hai wo set hoke firse starting pe aayega
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.CHAT_MESSAGE, ({ roomId, message, username }) => {
        io.to(roomId).emit(ACTIONS.CHAT_MESSAGE, { message, username });
    });

       

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]; //sare rooms ko map se array me
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave(); //kisi room se ham bahar nikal rahe hai
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));