
export class Mailer {
    private nodemailer: any;
    private transporter: any;
    private emailAccount: any = {
        user: 'info@web3go.xyz',
        password: 'Kusama2021',
        name: 'web3go info',

        clientId: '842394682956-f49kvlgjh6nv9jen9g1bju6es12vhof4.apps.googleusercontent.com',
        clientSecret: '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',

        refreshToken: "1//043VJSaR1WhXtCgYIARAAGAQSNwF-L9IrkvujGHKP4jcWrKH-V6q1PWmRdm-l-DL7rahPADMGjaPgFSTZb77aPU2NovyJ0zR4_-g",
        accessToken: "ya29.a0ARrdaM8NHxqPdPudfyxDs6nYfR7P9htt9mFa84CylZDav77ClpkgRcdnGUeb0HOmQ6NM0b1JqJ661-HwOj3hNjQvFujuPN-iTobDaYl46eMp6oBYo9s4zDP6usIYtFf7w5fkSxv5yZ4MS3X-VN4JUqbKt6FO",

    }
    constructor() {
        this.nodemailer = require("nodemailer");
        this.transporter = this.nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: this.emailAccount.user, // Your gmail address.
                // Not @developer.gserviceaccount.com
                clientId: this.emailAccount.clientId,
                clientSecret: this.emailAccount.clientSecret,
                refreshToken: this.emailAccount.refreshToken,
                accessToken: this.emailAccount.accessToken
            }
        });
        console.log("init mailer");

    }

    async send(mailOptions: MailOptions): Promise<any> {
        let mailOption = {
            from: '"' + this.emailAccount.name + '" <' + this.emailAccount.user + '>', // sender address
            to: mailOptions.to,
            subject: mailOptions.subject,
            html: mailOptions.html || '',
        };

        // send mail with defined transport object 
        let self = this;
        return await this.transporter.sendMail(mailOption, function (error, response) {
            console.log(error);
            console.log(response);
            self.transporter.close();
        });

    }
}
export class MailOptions {
    to!: string;// list of receivers
    subject!: string;// Subject line 
    html?: string;// html body
}