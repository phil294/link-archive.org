import nodemailer from 'nodemailer';

class MailService {
    constructor(sender, senderPassword) {
        this.sender = sender;
        this.senderPassword = senderPassword;
        // todo private
        this.nodemailerTransport = nodemailer.createTransport({
            service: 'gmail', // todo
            auth: {
                user: this.sender,
                pass: this.senderPassword,
            },
        });
        this.sendMail = (recepient, subject, bodyHtml) =>
            this.nodemailerTransport.sendMail({
                from: this.sender,
                to: recepient,
                subject,
                html: bodyHtml,
            });
    }
}

export default MailService;
