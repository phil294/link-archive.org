import { createTransport, SentMessageInfo } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer'; // tslint:disable-line:import-name

class MailService {
    private sender: string;
    private nodemailer_transport: Mail;
    constructor(service: string, sender: string, sender_password: string) {
        this.sender = sender;
        this.nodemailer_transport = createTransport({
            service,
            auth: {
                pass: sender_password,
                user: this.sender,
            },
        });
    }
    public send_mail(recepient: string, subject: string, body_html: string): Promise<SentMessageInfo> {
        return this.nodemailer_transport.sendMail({
            subject,
            from: this.sender,
            html: body_html,
            to: recepient,
        });
    }
}

export default MailService;
