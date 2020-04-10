import express from 'express';
import { UNPROCESSABLE_ENTITY } from 'http-status-codes';
import MailService from '../services/MailService';
import { error, html_escape } from '../utils';

export default (mail_service: MailService) => {

    const error_router = express.Router();

    /**
     * For any error processing from outside the server. Unauthenticated access
     * This logs the error and (as per logger configuration) sends emails to admins
     * (with rate limiting as defined in MailService.ts)
     */
    error_router.post('/', async (req, res) => {
        error('Error message received', req.body);
        if (!req.body.error)
            return res.status(UNPROCESSABLE_ENTITY).send('field error missing');
        await mail_service.send_mail(
            'FIXME - Insert desired error message receiving email here',
            'Error message received',
            html_escape(req.body.error.replace(/\\n/g, '\n')));
        return res.end();
    });

    /*
    error_router.post('/bugreport', async (req: any, res: any) => {
        if (!req.body.body || !req.body.subject)
            return res.status(UNPROCESSABLE_ENTITY).send('subject / body missing');
        await mail_service.send_mail(
            '??????',
            req.body.subject,
            html_escape(req.body.body.replace(/\n/g, '\n\n'))
                .replace(/\n/g, '\n<br>'));
        return res.end();
    });
    */

    return error_router;
};
