'use server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    auth: {
        user: "pranavkd@v2.ktucyber.com",
        pass: "Pranav44KD",
    },
});


const domain = process.env.MAIL_DOMAIN || 'v2.ktucyber.com';

export async function sendMail({
    email,
    sendTo,
    subject,
    html,
}: {
    email: string;
    sendTo?: string;
    subject: string;
    html?: string;
}) {
    //   try {
    //     const isVerified = await transporter.verify();
    //   } catch (error) {
    //     return;
    //   }
    const info = await transporter.sendMail({
        from: email,
        to: sendTo || "pkdartyt@gmail.com",
        subject: subject,
        html: html ? html : '',
    });
    console.log('Message Sent', info);
    return info;
}

export async function sendEmailVerification({ email, token }: { email: string; token: string }) {
    const verificationLink = `https://${domain}/userVerify?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 40px;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
          <h2 style="color: #2d3748; text-align: center;">Verify Your Email Address</h2>
          <p style="color: #4a5568; font-size: 16px;">
            Thank you for registering with <b>${domain}</b>!<br>
            Please confirm your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationLink}" style="background: #3182ce; color: #fff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-size: 18px; font-weight: bold; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #718096; font-size: 14px;">
            If you did not create an account, you can safely ignore this email.<br>
            This link will expire soon for your security.
          </p>
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #a0aec0; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} ${domain}. All rights reserved.
          </p>
        </div>
      </div>
    `;
    return sendMail({
        email: `no-reply@${domain}`,
        sendTo: email,
        subject: "Verify your email address",
        html,
    });
}

export async function sendPasswordResetEmail({ email, token }: { email: string; token: string }) {
    const resetLink = `https://${domain}/reset-password?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 40px;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
          <h2 style="color: #2d3748; text-align: center;">Reset Your Password</h2>
          <p style="color: #4a5568; font-size: 16px;">
            We received a request to reset your password for your account on <b>${domain}</b>.<br>
            Click the button below to set a new password:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="background: #e53e3e; color: #fff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-size: 18px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #718096; font-size: 14px;">
            If you did not request this change, you can safely ignore this email.<br>
            This link will expire soon for your security.
          </p>
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #a0aec0; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} ${domain}. All rights reserved.
          </p>
        </div>
      </div>
    `;
    return sendMail({
        email: `no-reply@${domain}`,
        sendTo: email,
        subject: "Reset your password",
        html,
    });
}