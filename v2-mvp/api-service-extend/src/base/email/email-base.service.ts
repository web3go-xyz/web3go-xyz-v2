import { Injectable } from '@nestjs/common';

import { W3Logger } from 'src/base/log/logger.service';
import { Mailer } from 'src/base/email/mailer';
import { join } from 'path';
import { AppConfig } from 'src/base/setting/appConfig';
import { VerifyCodePurpose } from 'src/viewModel/VerifyCodeType';

@Injectable()
export class EmailBaseService {

  logger: W3Logger;

  constructor(

  ) {
    this.logger = new W3Logger(`EmailBaseService`);
  }
  sendEmail(email: string, subject: string, html: string) {
    let mailer = new Mailer();
    mailer.send({
      to: email,
      subject: subject,
      html: html
    });
    return "email sent success";
  }
  generateEmail4ResetPassword(nickName: string, code: string, expiredMinutes: number) {

    let email_template = join(__dirname, '../../..', 'public/password.html');
    var replacements = {
      NICK_NAME: nickName,
      EXPIRED_MINUTES: expiredMinutes.toString(),
      VERIFY_CODE: code
    };
    let htmlToSend = this.generateEmail(email_template, replacements);
    this.logger.debug(`generateEmail4VerifyCode:${htmlToSend}`);
    return htmlToSend;
  }
  generateEmail4Code(nickName: string, code: string, expiredMinutes: number) {

    let email_template = join(__dirname, '../../..', 'public/code.html');
    var replacements = {
      NICK_NAME: nickName,
      EXPIRED_MINUTES: expiredMinutes.toString(),
      VERIFY_CODE: code
    };
    let htmlToSend = this.generateEmail(email_template, replacements);
    this.logger.debug(`generateEmail4VerifyCode:${htmlToSend}`);
    return htmlToSend;
  }

  generateEmail4AccountActivate(purpose: VerifyCodePurpose, email: string, accountId: string, nickName: string, code: string, expiredMinutes: number) {
    let email_template = join(__dirname, '../../..', 'public/activate.html');

    let url = (AppConfig.BASE_WEB_URL || 'http://localhost:3000') + `/verifyEmail?accountId=${accountId}&email=${escape(email)}&code=${code}&verifyCodePurpose=${purpose}`;
    let replacements = {
      NICK_NAME: nickName,
      EXPIRED_MINUTES: expiredMinutes.toString(),
      ACTIVATE_URL: url,
      STATIC_ASSET_PREFIX: AppConfig.STATIC_ASSET_PREFIX
    };
    let htmlToSend = this.generateEmail(email_template, replacements);
    // this.logger.debug(`generateEmail4AccountActivate:${htmlToSend}`);
    return htmlToSend;
  }
  private generateEmail(email_template_path: string, replacements: any) {
    this.logger.debug(`email_template_path:${email_template_path}`);
    var fs = require("fs");
    let data = fs.readFileSync(email_template_path);
    let email_content: string = '';
    if (data) {
      email_content = data.toString();
    }
    //update image links with prefix
    email_content = email_content.replace(/.\/images/g, AppConfig.STATIC_ASSET_PREFIX + 'images');

    let handlebars = require('handlebars');
    let template = handlebars.compile(email_content);

    let htmlToSend = template(replacements);
    // this.logger.debug(`generateEmail for email_template_path=${email_template_path}:${htmlToSend}`);
    return htmlToSend;
  }

}
