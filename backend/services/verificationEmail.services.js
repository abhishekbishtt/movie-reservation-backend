const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

/**
 * Send email verification link to new user
 * @param {string} email - User's email address
 * @param {string} verificationLink - Full verification URL with token
 */
const sendVerificationEmail = async (email, verificationLink) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"CineBook" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your CineBook Account',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .link { word-break: break-all; color: #3b82f6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 CineBook</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for registering with CineBook! To complete your registration and start booking movie tickets, please verify your email address.</p>
              
              <p style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email</a>
              </p>
              
              <p>Or copy and paste this link in your browser:</p>
              <p class="link">${verificationLink}</p>
              
              <p><strong>This link will expire in 24 hours.</strong></p>
              
              <p>If you didn't create an account with CineBook, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} CineBook. All rights reserved.</p>
              <p>Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

module.exports = sendVerificationEmail;
