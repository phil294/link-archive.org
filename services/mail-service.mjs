import nodemailer from 'nodemailer';

class MailService {
    constructor(sender, senderPassword) {
        this.sender = sender;
        // todo private
        this.nodemailerTransport = nodemailer.createTransport({
            service: 'gmail', // todo
            auth: {
                user: this.sender,
                pass: senderPassword,
            },
        });
    }
    sendMail(recepient, subject, bodyHtml) {
        return this.nodemailerTransport.sendMail({
            from: this.sender,
            to: recepient,
            subject,
            html: bodyHtml,
        });
    }
}

export default MailService;
