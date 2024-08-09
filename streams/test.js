var nodejsmailer  = require('nodemailer'); // use mailer nodejs module

var mailOptions ={
    from:'test1524521@gmail.com',
    to:'obidjanow@mail.ru',
    subject:"Sending Email to Rajat",
    text:"Welcome to NodeMailer, It's Working",
    html: '<h1>Welcome</h1><p>That was easy!</p>'
}    // details of to send from, to,  subject, text(message),
var transporter = nodejsmailer.createTransport({
    service:'gmail',
    auth:{
        user:'test1524521@gmail.com',
        pass:'jbmaouochvbtpfke'      // note: always keep password in .env file to keep it hidden
    }
}); // initialize create Transport service
//sends the mail
transporter.sendMail(mailOptions,function(error,info){
     if(error){
         console.log(error);
     }else{
         console.log('Email Send ' + info.response);
     }
});