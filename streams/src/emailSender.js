const nodemailer = require("nodemailer");

class EmailSendler{
  constructor(config, logger){
    this.config = config;
    this.logger = logger;
    
    this.transporter = nodemailer.createTransport({
      host: `smtp.${config.emailConfig.service}`,
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: config.emailConfig.auth.user,
        pass: config.emailConfig.auth.pass,
      },
    });
  }

  async send(){
    const info = await this.transporter.sendMail({
      from: `"Streams internship" <${this.config.emailConfig.auth.user}>`, // sender address
      to: this.config.emailConfig.to, // list of receivers
      subject: "file processed", // Subject line
      text: this.logger.getResultStr(), // plain text body
    });
  
    this.logger.addLog(`Message sent: ${info.messageId}`);
  }
}

module.exports = EmailSendler;