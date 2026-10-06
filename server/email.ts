import dotenv from 'dotenv';
dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY || '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';
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'pps581885@gmail.com'; // Verified Brevo sender address
const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

export interface EmailOptions {
  toEmail: string;
  fullName: string;
  verificationLink?: string;
  resetLink?: string;
}

export async function sendVerificationEmail({ toEmail, fullName, verificationLink }: EmailOptions): Promise<boolean> {
  if (!verificationLink) return false;

  try {
    const payload = {
      sender: {
        name: 'MANAV Education Platform',
        email: BREVO_SENDER_EMAIL,
      },
      to: [{ email: toEmail, name: fullName }],
      subject: 'Verify your email for MANAV',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
            .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            .logo { font-size: 24px; font-weight: 800; color: #0c2340; font-family: Georgia, serif; letter-spacing: -0.5px; }
            .tagline { font-size: 11px; font-weight: 700; color: #b45309; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
            .title { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 24px; margin-bottom: 12px; }
            .body-text { font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px; }
            .btn-wrapper { text-align: center; margin: 28px 0; }
            .btn { background-color: #0c2340; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(12, 35, 64, 0.2); }
            .link-text { font-size: 12px; color: #64748b; word-break: break-all; margin-top: 20px; }
            .footer { margin-top: 32px; pt-16px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">MANAV</div>
            <div class="tagline">AWAKENING HUMAN POTENTIAL</div>
            
            <div class="title">Hello ${fullName}, welcome!</div>
            <p class="body-text">
              Thank you for registering. Please click on the <strong>Verify Email</strong> option below to complete your registration and activate your account.
            </p>

            <div class="btn-wrapper">
              <a href="${verificationLink}" class="btn">Verify Email Address</a>
            </div>

            <p class="link-text">
              If the button does not work, copy and paste this verification link into your browser:<br/>
              <a href="${verificationLink}" style="color: #2563eb;">${verificationLink}</a>
            </p>

            <div class="footer">
              This single-use verification link will expire in 24 hours.<br/>
              If you did not request this account, you can safely ignore this email.<br/>
              © Delhi Technological University • MANAV Human Development System
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const res = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[BREVO EMAIL ERROR] Failed to send verification email:', errText);
      return false;
    }

    const data: any = await res.json();
    console.log(`[BREVO EMAIL DELIVERED SUCCESS] Message ID: ${data.messageId} sent to ${toEmail}`);
    return true;
  } catch (err) {
    console.error('[BREVO EMAIL EXCEPTION] Exception during verification email dispatch:', err);
    return false;
  }
}

export async function sendPasswordResetEmail({ toEmail, fullName, resetLink }: EmailOptions): Promise<boolean> {
  if (!resetLink) return false;

  try {
    const payload = {
      sender: {
        name: 'MANAV Education Platform',
        email: BREVO_SENDER_EMAIL,
      },
      to: [{ email: toEmail, name: fullName }],
      subject: 'Reset your MANAV password',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
            .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            .logo { font-size: 24px; font-weight: 800; color: #0c2340; font-family: Georgia, serif; }
            .tagline { font-size: 11px; font-weight: 700; color: #b45309; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
            .title { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 24px; margin-bottom: 12px; }
            .body-text { font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px; }
            .btn-wrapper { text-align: center; margin: 28px 0; }
            .btn { background-color: #0c2340; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(12, 35, 64, 0.2); }
            .link-text { font-size: 12px; color: #64748b; word-break: break-all; margin-top: 20px; }
            .footer { margin-top: 32px; pt-16px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">MANAV</div>
            <div class="tagline">AWAKENING HUMAN POTENTIAL</div>
            
            <div class="title">Hello ${fullName}, password reset requested</div>
            <p class="body-text">
              We received a request to reset your password for your MANAV account. Click the button below to choose a new password.
            </p>

            <div class="btn-wrapper">
              <a href="${resetLink}" class="btn">Reset Password</a>
            </div>

            <p class="link-text">
              If the button does not work, copy and paste this link into your browser:<br/>
              <a href="${resetLink}" style="color: #2563eb;">${resetLink}</a>
            </p>

            <div class="footer">
              This password reset link is valid for 1 hour.<br/>
              If you did not request a password reset, please ignore this message. Your password will remain unchanged.<br/>
              © Delhi Technological University • MANAV Human Development System
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const res = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[BREVO EMAIL ERROR] Failed to send password reset email:', errText);
      return false;
    }

    const data: any = await res.json();
    console.log(`[BREVO EMAIL DELIVERED SUCCESS] Message ID: ${data.messageId} sent to ${toEmail}`);
    return true;
  } catch (err) {
    console.error('[BREVO EMAIL EXCEPTION] Exception during password reset email dispatch:', err);
    return false;
  }
}
