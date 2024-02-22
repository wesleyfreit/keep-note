import { env } from '@/env';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: env.SENDER_HOST,
  port: env.SENDER_PORT,
  auth: {
    user: env.SENDER_USER,
    pass: env.SENDER_PASS,
  },
});

export const sendEmailVerification = async (
  name: string,
  email: string,
  token: string,
) => {
  await transporter.sendMail({
    from: env.SENDER_FROM,
    to: email,
    subject: 'Verifque o seu email cadastrado em Keep Note',
    html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta content="text/html" charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <div>
          <p>Olá, ${name}!</p> 
          <p>Verifique o seu email cadastrado em Keep Note clicando neste link: <a href="${env.ORIGIN_URL}/verify-email?code=${token}">${env.ORIGIN_URL}/verify-email?code=${token}</a>.</p>
          <p>Se você não se cadastrou em Keep Note, ignore este email.</p>
          <p>Atenciosamente, Keep Note.</p>
          <p style="color:#555">Este é um email automático, por favor não responda.</p>
        </div>
      </body>
    </html>
    `,
  });
};
