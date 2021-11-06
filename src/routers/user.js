const express = require('express');
const { findById } = require('../models/user');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer  = require('multer');
const sharp = require('sharp');
const {sendingMail,cencelService} = require('../email/account')
const router =  express.Router();


// create user request
router.post('/users',async (req,res)=>{
    const user = new User(req.body);
    
    try{
        await user.save();
        sendingMail(user.email,user.name)
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    }catch(e){
        res.status(400).send(e);
    }

});

// read all user query
router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
})


// update data
router.patch('/users/me',auth,async (req,res)=>{
    console.log('req user',req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','age','password','email'];
    const isValidation = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidation){
        return res.status(400).send({error: 'Invalid updates'});
    }
    try{
        updates.forEach((update)=>req.user[update] = req.body[update])
        await req.user.save();
        res.send(req.user);
    }catch(e){
        res.status(400).send();
    }
})

//login router
router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredential(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({user,token});
    }catch(e){
        res.status(400).send();
    }
})
//logout
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save();
        res.send();
        
    }catch(e){
        res.status(500).send();
    }
})

//logoutall 
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
})


// delte request
router.delete('/users/me',auth,async (req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.params.id);
        // if(!user){
        //     return res.status(404).send({error: 'Id not found'});
        // }
        
        await req.user.remove();
        cencelService(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e);
    }
})

// setup destination
const upload = multer({ 
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Uploaded file is not a Image file'));
        }
        cb(null,true);
    }
})

// setup end point for avatar upload

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png()
    .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

// setup end point for delete avatar image
router.delete('/users/me/avatar',auth,async(req,res)=>{
    let checkAvatar = req.user.avatar;
    let user = req.user;
    if(!checkAvatar || !user){
        res.status(400).send('No avatar found')
    }
    req.user.avatar = undefined;
    await req.user.save();
    res.send();

})


// setup end point for getting user image 
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        let user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error('No Image or user found associated with the id');
        }
        res.set('Content-Type','image/png');
        res.send(user.avatar);
    }catch(e){
        console.log(e);
        res.status(404).send({error:e.message})
    }

})


module.exports = router;

