const client = require('../index.js')

const dbClient = client.db('socket');
let databaseInitialized = false;

async function init(){
    databaseInitialized = true;
    await dbClient.collection('users').createIndex({uuid : 1},
        {unique : true})
}

async function userSocketID(uuid,socketID){
    const flag = await userExist(uuid);
    return flag ? await dbClient.collection('users').updateOne({
        uuid : uuid}, {
        $set : {
            socketId : socketID
        }
    }) : null
}

async function getUserSocketID(userID){
    const receiver = await dbClient.collection('users').findOne({
        userID : userID
    })
    return receiver.socketID;
}

async function userExist(uuid){
    return await dbClient.collection('users').findOne({uuid : uuid})
}

async function updateMessage(receiver, sender, message, sender_name){
    const cnv1 = [receiver,sender].sort().join("_")
    return await dbClient.collection('conversations').updateOne(
        {conversation_id : cnv1},
        {$push : {
                messages : {
                    content : message,
                    sender : sender_name,
                    timestamp : Date.now()
                }
            }}
    )
}

module.exports = {userSocketID,userExist,getUserSocketID,updateMessage}