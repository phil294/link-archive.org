import { createTransport, SentMessageInfo } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer'; // tslint:disable-line:import-name

class MailService {
    private sender: string;
    private nodemailerTransport: Mail;
    constructor(service: string, sender: string, senderPassword: string) {
        this.sender = sender;
        this.nodemailerTransport = createTransport({
            service,
            auth: {
                pass: senderPassword,
                user: this.sender,
            },
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
