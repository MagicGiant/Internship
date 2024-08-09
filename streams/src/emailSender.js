const nodemailer = require("nodemailer");

class EmailSendler{
  constructor(config, logger){
    this.config = config;
    this.logger = logger;
    
    this.transporter = nodemailer.createTransport({
      service: config.emailConfig.service,
      auth: config.emailConfig.auth
    })
  }

  async send(){
    const info = await this.transporter.sendMail({
      from: this.config.emailConfig.auth.user, // sender address
      to: this.config.emailConfig.to, // list of receivers
      subject: "file processed", // Subject line
      text: this.logger.getResultStr(), // plain text body
    });
  
    this.logger.addLog(`Message sent: ${info.messageId}`);
  }
}

module.exports = EmailSendler;