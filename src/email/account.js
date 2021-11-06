const nodemailer = require("nodemailer");
//mail send using node mailer
async function sendingMail(email,name){
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        service: "hotmail",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'mccyber007@gmail.com', // generated ethereal user
            pass: process.env.MAILER_AUTH_PASS, // generated ethereal password
        },
    })
    let info = await transporter.sendMail({
        from: 'mccyber007@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Thank you for Joining Us", // Subject line
        text: `Welcome to the app, ${name.toUpperCase()}.Let me know how you  get along with the app`
    });

    

    console.log("Message sent: %s", info.messageId);
}

async function cencelService(email,name){
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        service: "hotmail",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'mccyber007@gmail.com', // generated ethereal user
            pass: process.env.MAILER_AUTH_PASS, // generated ethereal password
        },
    })
    let info = await transporter.sendMail({
        from: 'mccyber007@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Good Bye", // Subject line
        text: `Good Bye, ${name.toUpperCase()}.Hopefully see you soon`
    });

    

    console.log("Message sent: %s", info.messageId);
} 


module.exports={
    sendingMail: sendingMail,
    cencelService: cencelService
}