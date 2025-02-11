const {userSocketID,updateMessage} = require('./socketIODB.js')

//below code will store the socket information in RAM memory which is not
//feasible on large user base

function socketIO(io){
    io.on('connection',(socket)=>{
        console.log(`User Connected: ${socket.id}`)
        socket.on('initialize',async(uuid)=>{
            await userSocketID(uuid,socket.id);
        })
        socket.on('chat-user',async(body)=>{
            const {receiverSocketID, message, sender, sender_name, receiver} = body;
            console.log(sender_name)
            await updateMessage(receiver, sender, message, sender_name);
            socket.emit('message-user',{
                message : message,
                by : {
                    uuid : sender,
                    name : sender_name
                }
            })
            io.to(receiverSocketID).emit('message-user',{
                message : message,
                by : {
                    uuid : sender,
                    name : sender_name
                }
            })
        })
        socket.on('disconnect',()=>{
            console.log(`User disconnected: ${socket.id}`);
        })
    })
}

module.exports = socketIO;


