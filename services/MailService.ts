import { createTransport, SentMessageInfo } from 'nodemailer';
// import { Mail } from 'nodemailer/lib/mailer'; // todo kb

class MailService {
    private sender: string;
    private nodemailerTransport: any; // todo Mail
    constructor(sender: string, senderPassword: string) {
        this.sender = sender;
        this.nodemailerTransport = createTransport({
            auth: {
                pass: senderPassword,
                user: this.sender,
            },
            service: 'gmail', // todo
        });
    }
    public sendMail(recepient: string, subject: string, bodyHtml: string): Promise<SentMessageInfo> {
        return this.nodemailerTransport.sendMail({
            subject,
            from: this.sender,
            html: bodyHtml,
            to: recepient,
        });
    }
}

export default MailService;
