const express = require('express');
const { updateNumber, updateSkill, imageUpload, createChat, updateReferral, updateService } = require('./database');
const multer = require('multer')

const router = express.Router();

/* this code is used to upload to a folder and uses disk space
const upload = multer({dest : "upload/"})
*/

// multer code to store image in server RAM and upload
const storage = multer.memoryStorage()
const upload = multer({ 
    storage: storage,
    limits : {
        fileSize : 200000
    }
 });

router.get("/",(req,res,next)=>{
    res.send(`<p>404 Error</p>`)
})

router.post("/phN",express.json(),async(req,res,next)=>{
    const {phone_number, mail}=  req.body;
    const getUpdatedUser = await updateNumber(phone_number,mail);
    res.send(getUpdatedUser);
})

router.post("/referral",express.json(),async(req,res,next)=>{
    const {mail,referral}=  req.body;
    const getUpdatedUser = await updateReferral(mail,referral);
    getUpdatedUser ? res.status(200).send('Referral Added') : res.status(400).send("Error")
})

router.post("/service",express.json(),async(req,res,next)=>{
    const {mail,service}=  req.body;
    const getUpdatedUser = await updateService(mail,service);
    getUpdatedUser ? res.status(200).send('Service Requested') : res.status(400).send("Error")
})

router.post("/pSkill",express.json(),async(req,res,next)=>{
    const {primary_skill, mail}=  req.body;
    const getUpdatedUser = await updateSkill(primary_skill,mail);
    res.send(getUpdatedUser);
})

router.post("/pImage",upload.single('profile-image'),async(req,res)=>{
    console.log('ji')
    try{
        const {mail} = req.body;
        if(!req.file){
            return res.status(400).send('No file uploaded.');
        }
        console.log(req.file)
        const file = {
            filename : req.file.originalname,
            contentType : req.file.mimetype,
            data : req.file.buffer
        }
        const imgUser= await imageUpload(mail, file)
        if(imgUser){
            res.status(200).send(file)
        }

    }catch(error){
        if(error instanceof multer.MulterError){
            if(error.code === "LIMIT_FILE_SIZE"){
                return res.status(400).send("File Upload Size Limit Should be below 200KB")
            }
            return res.status(400).send(`Multer error: ${err.message}`);
        }
    }
})

router.post("/create/ChatID",express.json(),async(req,res)=>{
    const users = req.body;
    console.log('in server startj')
    const createChatStatus = await createChat(users.currentUserMail,users.selectedUserMail);
    return createChatStatus === "400" ? res.status(400).send('ERROR When Creating Chat ID')
    : res.status(200).send({
        message : "Chat ID Successfully Created",
        chat_id : createChatStatus
    })
    
})



module.exports = router;