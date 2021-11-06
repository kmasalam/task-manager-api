// getting-started.js
const mongoose = require('mongoose');
// Validator Package
var validator = require('validator');


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);


   

    // const task = new tasks({
    //     description: 'Learning',
    // })

    // task.save().then(()=>{
    //     console.log('result ', task);
    // }).catch((error)=>{
    //     console.log('error is ',error);
    // })
}



