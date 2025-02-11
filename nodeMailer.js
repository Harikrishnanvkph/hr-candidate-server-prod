const nodemailer = require('nodemailer');

// Create a Sender
const transporter = nodemailer.createTransport({
    service : "gmail",
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user : process.env.MAIL,
        pass : process.env.MAIL_KEY
    }
})


// Send mail using transporter
async function sendMail(mail){
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: {
                name : "HARI HR Hiring App",
                address : process.env.MAIL
            }, // Sender address
            to: mail, // Receiver address
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // Plain text body
            html: `<div>Welcome to HARI GAS BOOKING!🎉👏 <div>
            <div>Your Pin Code to Verify your account is <b>${pin} 📌</b><div>`, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error occurred while sending email:", error);
        return false;
    }
}