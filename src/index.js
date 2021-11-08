const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('../src/routers/user');
const taskRouter = require('../src/routers/task');

const app = express();

// Declare port
const port = process.env.PORT;




app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});



app.use(express.json());
app.use(userRouter);
app.use(taskRouter);




app.listen(port,()=>{
    console.log(`Example app is listening port ${port}`);
})




