import { ServerClient } from 'postmark';

const postmarkClient = new ServerClient(process.env.POSTMARK_API_TOKEN);

export async function sendVerificationEmail(to, verifyUrl) {
  await postmarkClient.sendEmail({
    From: process.env.POSTMARK_FROM_EMAIL,
    To: to,
    Subject: 'Verify your email',
    HtmlBody: `Please verify your email by clicking the following link: <a href="${verifyUrl}">${verifyUrl}</a>`,
  });
} 