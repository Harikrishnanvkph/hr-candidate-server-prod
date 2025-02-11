const client = require("./index.js")
const bcrypt = require('bcrypt');
const { genPassword, createChatID } = require("./logic");

const dbClient = client.db("HRHIRE");
const socketClient = client.db('socket');

// Below createIndex code is already done no need to redo everytime
// async function init(){
//     await dbClient.collection("Candidate").createIndex({firstName : 1})
//     await dbClient.collection("Candidate").createIndex({mail : 1},{
//         unique : 1
//     })
// }

//Getting or Checking users in the list
async function getCandidate(mail){
    return await dbClient.collection("Candidate").findOne(
        {mail: mail},
        {projection : {_id: 0}}
    );
}


//Validating users
async function validateUser(mail,password){
    const checkEmployer = await getCandidate(mail);
    if(checkEmployer == null){
        return null;
    }
    const cb = await bcrypt.compare(password,checkEmployer.password);
    return cb ? "200" : "409"
}


//Registering User
async function registerUser(userDetail){
    const cUser = await getCandidate(userDetail.mail);
    if(cUser == null){
        const gId = await getId();
        await dbClient.collection("Candidate").insertOne({
            uuid : gId,
            mail : userDetail.mail,
            firstName : userDetail.firstName,
            name : userDetail.firstName,
            lastName : userDetail.lastName,
            password : await genPassword(userDetail.password),
            image : "",
            phone_number : "",
            company : "",
            referrals : [],
            services : []
        })
        await socketClient.collection('users').insertOne({
            uuid : gId,
            mail : userDetail.mail,
            name : userDetail.firstName,
            socketId : null
        })
        await setId(gId);
        return {
            uuid : gId,
            status : '200'
        };
    }
    return "409";
}

async function getId(){
    const gt =  await dbClient.collection("User_Id").findOne({},{id : 1, _id : 0});
    return gt.id;
}

async function setId(uuid){
    await dbClient.collection("User_Id").updateOne({},{
        $set : {
            id : uuid + 1
        }
    })
}

async function updateNumber(number,mail){
    const cUser = await getCandidate(mail);
    if(!cUser){
        return null;
    }

    await dbClient.collection("Candidate").updateOne(
        {mail : mail},{
            $set : {
                phone_number : number
            }
        })
    return await getCandidate(mail);
}

async function updateSkill(skill,mail){
    const cUser = await getCandidate(mail);
    if(!cUser){
        return null;
    }
    await dbClient.collection("Candidate").updateOne(
        {mail : mail},{
            $set : {
                company : skill
            }
        })
    return await getCandidate(mail);
}


//uploading Image in MongoDB
async function imageUpload(mail,file){
    const cUser = await getCandidate(mail);
    if(!cUser){
        return null;
    }

    return await dbClient.collection("Candidate" ).updateOne(
        {mail : mail},{
            $set : {
                image : file
            }
        })
}

//get
async function getReferral(){
    return await dbClient.collection("ReferralCompanies").find({}).toArray();
}

async function getService(){
    return await dbClient.collection("CandidateServices").find({}).toArray();
}

async function getMyReferral(mail){
    return await dbClient.collection("Candidate").findOne({mail: mail},
        {projection : {_id: 0, referrals: 1}}
    );
}

async function getMyService(mail){
    // console.log(mail)
    return await dbClient.collection("Candidate").findOne({mail: mail},
        {projection : {_id: 0, services: 1}}
    );
}


//update
async function updateReferral(mail, referral){
    const ref = await dbClient.collection("Candidate").updateOne({mail : mail},{
        $push : {
            referrals : referral
        }
    });
    return ref ? ref : null;
}

async function updateService(mail, service){
    const ref = await dbClient.collection("Candidate").updateOne({mail : mail},{
        $push : {
            services : service
        }
    });
    return ref ? ref : null;
}

//jsMessage
async function getCnvWithoutMsg(id){
    return await socketClient.collection('conversations').find({
        $or: [{"sender.uuid": id}, {"receiver.uuid": id}]
    }, {
        projection: {_id: 0, message: 0}
    }).toArray();
}

//jsMessage
async function getCnvWithConversationId(sender_id, receiver_id){
    const cnv = [sender_id, receiver_id].sort().join("_")
    return await socketClient.collection('conversations').findOne({
        conversation_id : cnv
    });
}

// socket database
async function getUserId(mail_id){
    return await client.db('socket').collection('users').findOne({
        mail : mail_id},
        {projection : {_id : 0}}
    )
}

async function getSocketID(uuid){
    return await client.db('socket').collection('users').findOne({
        uuid : uuid
    },{
        projection : {_id : 0,mail : 0, uuid : 0}
    })
}

async function searchUsers(name){
    return await dbClient.collection("Candidate").find(
        {firstName: {$regex : `^${name}`, $options : "i"}},
        {
            projection : {_id: 0, uuid : 1, mail : 1, name : 1}
        }
    ).toArray();
}

async function createConversation(sender, receiver){
    const cnv = [sender.user_id ?? sender.uuid,receiver.uuid ?? receiver.user_id].sort().join("_")
    const check = await socketClient.collection('conversations').findOne({
        conversation_id : cnv,
    },{projection : {_id : 0}})
    const {uuid,mail, name} = receiver
    delete sender.socketId
    return check ?? await socketClient.collection('conversations').insertOne({
        conversation_id : cnv,
        sender : sender,
        receiver : {
            uuid : uuid,
            mail : mail,
            name : name
        },
        messages : [{
            sender : receiver.name,
            content : `Hi ${sender.name},\nGreetings of the day\nthis is your helpdesk chat\nplease send a message for any assistance needed.`
        }]
    });
}

module.exports = {getCandidate,imageUpload,updateNumber,updateSkill,getUserId,
    registerUser, validateUser, getReferral, getService,updateReferral,
    updateService, getMyReferral,getMyService,getCnvWithoutMsg, getCnvWithConversationId,
    getSocketID, searchUsers,createConversation}
