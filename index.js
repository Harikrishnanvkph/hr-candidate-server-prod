const express = require("express");
const {MongoClient} = require("mongodb");
const dotenv = require("dotenv");
const cors = require("cors");
const {Server} = require('socket.io');
dotenv.config();

const port = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGO_URL);

const corsOptions = {
    origin: true, // Allow requests from any origin
    credentials: true, // Allow credentials (cookies, authorization headers)
};

const server = express();


async function InitiateDatabase(){
    await client.connect();
    console.log("Database Connected Successfully");
}

async function ConnectToServer(){
    server.use(cors(corsOptions));
    const httpServer = server.listen(port,()=>{
        console.log(`Connected to Server Successfully! http://localhost:${port}`)
    })
    const socketServer = new Server(httpServer,{
        cors : {
            origin : true
        },
        path : "/socket"
    })
    require('./SocketIO/socketIO.js')(socketServer);
    server.use(express.json());
    server.use("/",require("./loginAndRegister.js"));
    server.use("/update",require("./update.js"));
    server.use('/js/Messages',require('./jsMessage.js'))
}


async function init(){
    await InitiateDatabase();
    await ConnectToServer();
}

init().catch();

module.exports = client;

