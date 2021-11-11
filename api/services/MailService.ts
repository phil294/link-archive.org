import { createTransport, SentMessageInfo } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'; // eslint-disable-line
import { log } from '../utils'

class MailService {
	private sender: string;
	private nodemailer_transport: Mail;
	private last_error_time = 0;
	private error_count_in_last_10_seconds = 0;
	constructor(host: string, sender_user: string, sender_password: string) {
		this.sender = sender_user
		this.nodemailer_transport = createTransport({
			host,
			secure: true,
			auth: {
				pass: sender_password,
				user: this.sender,
			},
		})
	}
	public send_mail(recepient: string | string[], subject: string, body_html: string, ignore_throttling = false): Promise<SentMessageInfo> {
		if(!ignore_throttling) {
			// Prevent mail spam
			const now = Date.now()
			const time_since_last_error = now - this.last_error_time
			this.last_error_time = now
			if (time_since_last_error < 10000) {
				// Last error less then 10 seconds ago
				this.error_count_in_last_10_seconds++
				if (this.error_count_in_last_10_seconds > 3) {
					// More than 3 errors in 10 seconds: Do not send out any more mails
					log(`Error mail sending count limit exceeded (${this.error_count_in_last_10_seconds})`)
					return Promise.resolve(false)
				}
			} else {
				// Last error at least 10 seconds ago: Reset error counter to 1 and proceed with sending out error mails from now on
				this.error_count_in_last_10_seconds = 1
			}
		}

		return this.nodemailer_transport.sendMail({
			subject,
			from: this.sender,
			html: body_html,
			to: recepient,
		})
	}
}

export default MailService
