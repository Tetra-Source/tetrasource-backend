import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import nodemailer from 'nodemailer';
import path from 'path';
import handlebars from 'handlebars'
import fs from 'fs'
@injectable({scope: BindingScope.TRANSIENT})
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tetrasolutionsoftware@gmail.com',
        pass: 'bgkwyqtvooymloxa',
      },
    });
  }

  private compileTemplate(templateName: string, context: any): string {
    const templatePath = path.join('src/templates', `${templateName}.hbs`);

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    return template(context);
  }

  sendEmail(templateName: string, context: any) {
   const html = this.compileTemplate(templateName, context);

    const mailOptions = {
      from: 'tetrasolutionsoftware@gmail.com',
      to: 'bkrish058@gmail.com',
      subject: 'Product Enquiry Confirmation',
      html
    };
    this.transporter.sendMail(mailOptions, (err, info) => {
      if (err) return console.error(err);
      console.log('Email sent', info.response);
    });
  }
}
