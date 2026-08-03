import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { fromAddress, resendApiKey } from 'src/utils/config';

@Injectable()
export class EmailService {
    private resend: Resend;
    private fromAddress: string;
    constructor() {
        this.resend = new Resend(resendApiKey)
        this.fromAddress = fromAddress
    }
    async send(to: string, subject: string, html: string) {
        const { data, error } = await this.resend.emails.send({
            from: this.fromAddress,
            to,
            subject,
            html,
        });

        if (error) {
            console.error(`Send email failed: ${JSON.stringify(error)}`);
            throw error;
        }

        return data;
    }
}
