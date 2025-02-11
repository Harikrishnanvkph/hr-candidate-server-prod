const express = require('express');

const { validateUser, registerUser, getCandidate, getReferral, 
    getService, getMyReferral, getMyService } = require('./database');

const router = express.Router();

router.get("/",express.json(), async(req,res,next)=>{
    res.send("Welcome to Hari HR Candidate App");
})

router.post("/login",express.json(), async(req,res,next)=>{
    const request = req.body;
    const loginCheck = await validateUser(request.mail, request.password);
    res.send(loginCheck);
})


router.post("/register",express.json(), async(req,res,next)=>{
    const request = req.body;
    const rUser = await registerUser(request);
    res.send(rUser);
})


router.post("/user",express.json(),async (req,res,next)=>{
    const {mail} =  req.body;
    const getUser = await getCandidate(mail);
    res.send(getUser);
})

router.get("/referral",express.json(),async (req,res,next)=>{
    const getUser = await getReferral();
    // console.log('referral')
    res.send(getUser);
})

router.get("/service",express.json(),async (req,res,next)=>{
    const getUser = await getService();
    res.send(getUser);
})

router.post("/myreferral",express.json(),async (req,res,next)=>{
    const {mail} = req.body;
    const getUser = await getMyReferral(mail);
    res.send(getUser);
})

router.post("/myservices",express.json(),async (req,res,next)=>{
    const {mail} = req.body;
    const getUser = await getMyService(mail);
    res.send(getUser);
})


module.exports = router
