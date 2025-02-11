const {getCnvWithoutMsg, getCnvWithConversationId,getUserId,getSocketID, searchUsers
,createConversation} = require("./database");
const router = require('express').Router();

const express = require('express')

router.get("/",(req,res)=>{
    res.send('t')
})

router.post('/getConversation',async(req,res,next)=>{
    const {user_uuid} = req.body;
    const getCnv_without_msg = await getCnvWithoutMsg(user_uuid);
    res.send(getCnv_without_msg)
})

router.post('/createConversation',async(req,res,next)=>{
    const {sender, receiver} = req.body;
    const created = await createConversation(sender, receiver);
    console.log(created)
    res.send(created)
})

router.post('/getCnvWithConversationId',async(req,res,next)=>{
    const {sender_uuid, receiver_uuid} = req.body;
    const getCnv_with_msg = await getCnvWithConversationId(sender_uuid, receiver_uuid);
    res.send(getCnv_with_msg)
})

router.post('/getUserId',async(req,res,next)=>{
    const {mail} = req.body;
    const userSocketObj= await getUserId(mail);
    res.send(userSocketObj)
})

router.get('/getUserId',async(req,res,next)=>{
    res.json({
        status : 'ok'
    })
})

router.post('/getSocketId',async(req,res)=>{
    const {uuid} = req.body;
    const getSocket = await getSocketID(uuid);
    res.send(getSocket)
})

router.post('/search',async(req,res)=>{
    const {name} = req.body;
    const getSocket = await searchUsers(name);
    res.send(getSocket)
})

module.exports = router
