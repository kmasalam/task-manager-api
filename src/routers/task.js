const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const User = require('../models/user')
const router =  express.Router();


// create new task request
router.post('/tasks',auth,async (req,res)=>{
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

// read all task /GET /tasks?completed=false
// read all task /Get / tasks?limit=2&skip=0 0 hole first page limit 2 & skip 2hole 2nd page
// read task by asc/desc tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async(req,res)=>{
    
   
    const match = {};
    const sort = {};
    const skip = 0
    const limit = 10

    if(req.query.completed){
        match.completed = req.query.completed == 'true'
    }
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        console.log('sort ', sort.createdAt);
    }
    if(req.query.skip){
        skip = parseInt(req.query.skip)
    }
    if(req.query.limit){
        limit =parseInt(req.query.limit)
    }
    
    console.log('limit', limit,'skip',skip,);
    try{
        const task = await req.user.
        populate({
            path: 'tasks',
            match,
            options: {
                limit,
                skip,
                sort,
                
            },
           
        })
        
        res.send(task.tasks);
        }catch(e){
            res.status(500).send();
        }
})

// read single task
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id;

    try{
        const task = await Task.findOne({_id,owner:req.user._id});
        if(!task){
            return res.status(400).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
})


// updates task
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isValid = updates.every((update)=> allowedUpdates.includes(update));
    if(!isValid){
        return res.status(400).send({error: 'Invalid request'});
    }
    try{
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({_id: req.params.id,owner: req.user._id})
       
        if(!task){
            return res.status(404).send();
        }
        updates.forEach((update)=> task[update] = req.body[update])
        await task.save();
        res.send(task);
    }catch(e){
        res.status(400).send(e);
    }
})


// delte task by id
router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
        if (!task) {
            return res.status(404).send({error: "Id not Found"})
        }
        res.send(task);

    }catch(e){
        res.status(500).send();
    }
})

module.exports = router;